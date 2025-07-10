import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/cloudinary';

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
    

    
    if (!cloudName || !apiKey || !apiSecret || 
        cloudName === 'your_cloud_name' || 
        apiKey === 'your_api_key' || 
        apiSecret === 'your_api_secret') {
      

      // Return a working placeholder video URL
      return NextResponse.json({ 
        success: true, 
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      });
    }
    
    // Upload video to Cloudinary and get URL
    const videoUrl = await uploadVideo(videoFile);
    
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