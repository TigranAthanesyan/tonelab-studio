import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryPhoto extends Document {
  imageUrl: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryPhotoSchema: Schema = new Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the gallery photo']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'Description cannot be more than 300 characters'],
    default: ''
  }
}, {
  timestamps: true,
  versionKey: false
});

if (mongoose.models.GalleryPhoto) {
  delete mongoose.models.GalleryPhoto;
}

const GalleryPhoto = mongoose.model<IGalleryPhoto>('GalleryPhoto', GalleryPhotoSchema);

export default GalleryPhoto;
