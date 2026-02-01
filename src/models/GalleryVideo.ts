import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryVideo extends Document {
  youtubeUrl: string;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryVideoSchema: Schema = new Schema({
  youtubeUrl: {
    type: String,
    required: [true, 'Please provide a YouTube URL'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate YouTube URL format
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
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
if (mongoose.models.GalleryVideo) {
  delete mongoose.models.GalleryVideo;
}

const GalleryVideo = mongoose.model<IGalleryVideo>('GalleryVideo', GalleryVideoSchema);

export default GalleryVideo;
