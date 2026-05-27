import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';
import { authOptions } from '@/lib/auth-options';
import { GalleryPhotoCreateSchema } from '@/lib/validations';

export async function GET() {
  try {
    await dbConnect();
    const photos = await GalleryPhoto.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery photos' },
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
    const validation = GalleryPhotoCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const photo = await GalleryPhoto.create(validation.data);

    return NextResponse.json({ success: true, data: photo }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating gallery photo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create gallery photo';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
