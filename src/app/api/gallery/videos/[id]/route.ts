import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryVideo from '@/models/GalleryVideo';
import { authOptions } from '@/lib/auth-options';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const video = await GalleryVideo.findByIdAndDelete(params.id);
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const body = await request.json();
    const { title, order } = body;
    
    const video = await GalleryVideo.findByIdAndUpdate(
      params.id,
      { title, order },
      { new: true, runValidators: true }
    );
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Gallery video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error('Error updating gallery video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery video' },
      { status: 500 }
    );
  }
}
