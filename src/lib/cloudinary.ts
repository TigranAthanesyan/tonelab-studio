import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Utility function to upload image to Cloudinary
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tonelab-events',
      // transformation: [
      //   // { width: 800, height: 600, crop: 'fill' },
      //   { quality: 'auto' }
      // ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Utility function to upload video to Cloudinary
export const uploadVideo = async (file: File): Promise<string> => {
  try {
    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary with video-specific settings
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tonelab-events/videos',
      resource_type: 'video',
      // Video-specific transformations can be added here
      // transformation: [
      //   { width: 1280, height: 720, crop: 'scale' }
      // ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error('Failed to upload video');
  }
}; 