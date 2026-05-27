import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryVideo from '@/models/GalleryVideo';
import { authOptions } from '@/lib/auth-options';
import { GalleryVideoCreateSchema } from '@/lib/validations';
import { extractYoutubeId, fetchYoutubeOEmbed } from '@/lib/youtube';

export async function GET() {
  try {
    await dbConnect();
    const videos = await GalleryVideo.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error('Error fetching gallery videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validation = GalleryVideoCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const originalUrl = validation.data.originalUrl.trim();
    const youtubeId = extractYoutubeId(originalUrl);

    if (!youtubeId) {
      return NextResponse.json(
        { success: false, error: 'Could not extract a valid YouTube video ID from the URL' },
        { status: 400 }
      );
    }

    const existing = await GalleryVideo.findOne({ youtubeId });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This YouTube video is already in the gallery' },
        { status: 409 }
      );
    }

    let meta;
    try {
      meta = await fetchYoutubeOEmbed(`https://www.youtube.com/watch?v=${youtubeId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch YouTube metadata';
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const video = await GalleryVideo.create({
      youtubeId,
      originalUrl,
      title: meta.title,
      thumbnailUrl: meta.thumbnailUrl
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating gallery video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create gallery video';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
