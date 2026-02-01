import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryPhoto extends Document {
  imageUrl: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryPhotoSchema: Schema = new Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters'],
    default: ''
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Force model recreation to ensure schema changes are applied
if (mongoose.models.GalleryPhoto) {
  delete mongoose.models.GalleryPhoto;
}

const GalleryPhoto = mongoose.model<IGalleryPhoto>('GalleryPhoto', GalleryPhotoSchema);

export default GalleryPhoto;
