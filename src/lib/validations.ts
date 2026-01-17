import { z } from 'zod';

// User validation schemas
export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'user']).default('user')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Event validation schemas
// Custom validator for URLs that can be either full URLs or local paths
const imageOrVideoUrl = z.string().refine((val: string) => {
  // Allow local paths starting with /
  if (val.startsWith('/')) return true;
  // Allow full URLs
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}, 'Invalid URL or path');

export const EventCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters'),
  date: z.string().refine((date: string) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid date format'),
  ticketUrl: z.string().url('Invalid ticket URL'),
  imageUrl: imageOrVideoUrl,
  videoUrl: imageOrVideoUrl.optional()
});

export const EventUpdateSchema = EventCreateSchema.partial();

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;
