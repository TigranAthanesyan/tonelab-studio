"use client";

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './new.module.css';

export default function NewEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    ticketUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedImage) {
      setError('Please select an image for the event');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Upload image to Cloudinary
      const imageFormData = new FormData();
      imageFormData.append('image', selectedImage);

      const imageResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: imageFormData,
      });

      const imageData = await imageResponse.json();
      
      if (!imageData.success) {
        setError(`Image upload failed: ${imageData.error}`);
        setLoading(false);
        return;
      }

      // Step 2: Upload video if selected
      let videoUrl: string | undefined;
      if (selectedVideo) {
        const videoFormData = new FormData();
        videoFormData.append('video', selectedVideo);

        const videoResponse = await fetch('/api/upload-video', {
          method: 'POST',
          body: videoFormData,
        });

        const videoData = await videoResponse.json();
        
        if (!videoData.success) {
          setError(`Video upload failed: ${videoData.error}`);
          setLoading(false);
          return;
        }
        
        videoUrl = videoData.videoUrl;
      }

      // Step 3: Create event with the image URL and optional video URL
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        ticketUrl: formData.ticketUrl,
        imageUrl: imageData.imageUrl,
        videoUrl
      };
      
      const eventResponse = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      const eventData = await eventResponse.json();
      
      if (eventData.success) {
        router.push('/admin/events');
      } else {
        setError(eventData.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(`Failed to create event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size === 0) {
        setError('Selected file is empty');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size === 0) {
        setError('Selected video file is empty');
        return;
      }
      
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setError('Video file size must be less than 100MB');
        return;
      }
      
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin/events" className={styles.backLink}>
            ← Back to Events
          </Link>
          <h1 className={styles.title}>Create New Event</h1>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
              maxLength={100}
              placeholder="Enter event title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={6}
              required
              maxLength={1000}
              placeholder="Enter event description"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ticketUrl" className={styles.label}>
              Ticket URL (Showsforme Link) *
            </label>
            <input
              type="url"
              id="ticketUrl"
              name="ticketUrl"
              value={formData.ticketUrl}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="https://showsforme.com/..."
            />
            <small className={styles.helpText}>
              Enter the full URL to the event tickets on Showsforme or other ticketing platform
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Event Poster *
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className={styles.fileInput}
              accept="image/*"
              required
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={400} 
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="video" className={styles.label}>
              Event Video (Optional)
            </label>
            <input
              type="file"
              id="video"
              name="video"
              onChange={handleVideoChange}
              className={styles.fileInput}
              accept="video/*"
            />
            <small className={styles.helpText}>
              Supported formats: MP4, MOV, AVI. Max size: 100MB
            </small>
            {videoPreview && (
              <div className={styles.videoPreview}>
                <video controls width="100%" style={{ maxWidth: '400px' }}>
                  <source src={videoPreview} type={selectedVideo?.type} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/events" className={styles.cancelButton}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
