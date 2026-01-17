import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Helper function to save file locally
async function saveFileLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = file.name.split('.').pop() || 'mp4';
  const filename = `video-${uniqueSuffix}.${extension}`;
  const filepath = path.join(uploadsDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Return the public URL path (served via API route)
  return `/api/uploads/videos/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    
    if (!videoFile) {
      return NextResponse.json(
        { success: false, error: 'No video file provided' },
        { status: 400 }
      );
    }
    
    if (videoFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Video file is empty' },
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

    let videoUrl: string;

    if (isCloudinaryConfigured) {
      // Upload video to Cloudinary and get URL
      videoUrl = await uploadVideo(videoFile);
    } else {
      // Save locally as fallback for development
      console.log('Cloudinary not configured, saving video locally');
      videoUrl = await saveFileLocally(videoFile);
    }

    return NextResponse.json({ 
      success: true, 
      videoUrl 
    });
  } catch (error: unknown) {
    console.error('Error uploading video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload video';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 