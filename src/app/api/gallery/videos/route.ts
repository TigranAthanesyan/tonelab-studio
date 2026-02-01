import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryVideo from '@/models/GalleryVideo';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    await dbConnect();
    const videos = await GalleryVideo.find({}).sort({ order: 1, createdAt: -1 });
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
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    const { youtubeUrl, title, order } = body;
    
    if (!youtubeUrl) {
      return NextResponse.json(
        { success: false, error: 'YouTube URL is required' },
        { status: 400 }
      );
    }
    
    const videoData = {
      youtubeUrl,
      title: title || '',
      order: order || 0
    };
    
    const video = await GalleryVideo.create(videoData);
    
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
