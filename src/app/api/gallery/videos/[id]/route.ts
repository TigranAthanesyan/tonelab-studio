import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryVideo from '@/models/GalleryVideo';
import { authOptions } from '@/lib/auth-options';
import { GalleryVideoUpdateSchema } from '@/lib/validations';
import { extractYoutubeId, fetchYoutubeOEmbed } from '@/lib/youtube';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const video = await GalleryVideo.findById(id);

    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Gallery video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error('Error fetching gallery video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const validation = GalleryVideoUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await GalleryVideo.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Gallery video not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (validation.data.originalUrl) {
      const originalUrl = validation.data.originalUrl.trim();
      const youtubeId = extractYoutubeId(originalUrl);

      if (!youtubeId) {
        return NextResponse.json(
          { success: false, error: 'Could not extract a valid YouTube video ID from the URL' },
          { status: 400 }
        );
      }

      // If the underlying video changed, re-fetch metadata and ensure no duplicate.
      if (youtubeId !== existing.youtubeId) {
        const duplicate = await GalleryVideo.findOne({ youtubeId, _id: { $ne: id } });
        if (duplicate) {
          return NextResponse.json(
            { success: false, error: 'This YouTube video is already in the gallery' },
            { status: 409 }
          );
        }

        try {
          const meta = await fetchYoutubeOEmbed(`https://www.youtube.com/watch?v=${youtubeId}`);
          updateData.title = meta.title;
          updateData.thumbnailUrl = meta.thumbnailUrl;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch YouTube metadata';
          return NextResponse.json({ success: false, error: msg }, { status: 400 });
        }

        updateData.youtubeId = youtubeId;
      }

      updateData.originalUrl = originalUrl;
    }

    const video = await GalleryVideo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: video });
  } catch (error: unknown) {
    console.error('Error updating gallery video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery video';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    const video = await GalleryVideo.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Gallery video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error('Error deleting gallery video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery video' },
      { status: 500 }
    );
  }
}
