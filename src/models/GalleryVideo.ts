import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryVideo extends Document {
  youtubeId: string;
  originalUrl: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryVideoSchema: Schema = new Schema({
  youtubeId: {
    type: String,
    required: [true, 'YouTube video ID is required'],
    unique: true,
    trim: true
  },
  originalUrl: {
    type: String,
    required: [true, 'Original YouTube URL is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [300, 'Title cannot be more than 300 characters']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  }
}, {
  timestamps: true,
  versionKey: false
});

if (mongoose.models.GalleryVideo) {
  delete mongoose.models.GalleryVideo;
}

const GalleryVideo = mongoose.model<IGalleryVideo>('GalleryVideo', GalleryVideoSchema);

export default GalleryVideo;
