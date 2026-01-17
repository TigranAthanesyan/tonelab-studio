import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Helper function to save file locally
async function saveFileLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `image-${uniqueSuffix}.${extension}`;
  const filepath = path.join(uploadsDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Return the public URL path (served via API route)
  return `/api/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    if (imageFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Image file is empty' },
        { status: 400 }
      );
    }
    
    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    const isCloudinaryConfigured = cloudName && apiKey && apiSecret &&
        cloudName !== 'your_cloud_name' &&
        cloudName !== 'your-cloud-name' &&
        apiKey !== 'your_api_key' &&
        apiKey !== 'your-api-key' &&
        apiSecret !== 'your_api_secret' &&
        apiSecret !== 'your-api-secret';

    let imageUrl: string;

    if (isCloudinaryConfigured) {
      // Upload image to Cloudinary and get URL
      imageUrl = await uploadImage(imageFile);
    } else {
      // Save locally as fallback for development
      console.log('Cloudinary not configured, saving image locally');
      imageUrl = await saveFileLocally(imageFile);
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });
  } catch (error: unknown) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 