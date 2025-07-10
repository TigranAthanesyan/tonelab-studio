import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  ticketPrice: number;
  imageUrl: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the event'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the event'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the event']
  },
  ticketPrice: {
    type: Number,
    required: [true, 'Please provide a ticket price for the event'],
    min: [0, 'Ticket price cannot be negative']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the event']
  },
  videoUrl: {
    type: String,
    required: false,
    default: undefined
  }
}, {
  timestamps: true,
  // Add schema version to force refresh
  versionKey: false
});

// Force model recreation to ensure schema changes are applied
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

// Export the model, ensuring it's properly typed
const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event; 