import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    await dbConnect();
    const photos = await GalleryPhoto.find({}).sort({ order: 1, createdAt: -1 });
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
    const { imageUrl, description, order } = body;
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    const photoData = {
      imageUrl,
      description: description || '',
      order: order || 0
    };
    
    const photo = await GalleryPhoto.create(photoData);
    
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
