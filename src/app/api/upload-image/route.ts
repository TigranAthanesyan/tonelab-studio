import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

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
    

    
    if (!cloudName || !apiKey || !apiSecret || 
        cloudName === 'your_cloud_name' || 
        apiKey === 'your_api_key' || 
        apiSecret === 'your_api_secret') {
      

      // Return a working placeholder image URL
      return NextResponse.json({ 
        success: true, 
        imageUrl: 'https://picsum.photos/800/600?random=1'
      });
    }
    
    // Upload image to Cloudinary and get URL
    const imageUrl = await uploadImage(imageFile);
    
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