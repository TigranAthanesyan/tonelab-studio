import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';
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
    
    const photo = await GalleryPhoto.findByIdAndDelete(params.id);
    
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Gallery photo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: photo });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery photo' },
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
    const { description, order } = body;
    
    const photo = await GalleryPhoto.findByIdAndUpdate(
      params.id,
      { description, order },
      { new: true, runValidators: true }
    );
    
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Gallery photo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: photo });
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery photo' },
      { status: 500 }
    );
  }
}
