import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';
import { authOptions } from '@/lib/auth-options';
import { GalleryPhotoUpdateSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const photo = await GalleryPhoto.findById(id);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Gallery photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: photo });
  } catch (error) {
    console.error('Error fetching gallery photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery photo' },
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

    const validation = GalleryPhotoUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const photo = await GalleryPhoto.findByIdAndUpdate(
      id,
      validation.data,
      { new: true, runValidators: true }
    );

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Gallery photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: photo });
  } catch (error: unknown) {
    console.error('Error updating gallery photo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery photo';
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
    const photo = await GalleryPhoto.findByIdAndDelete(id);

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
