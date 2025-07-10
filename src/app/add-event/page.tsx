"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add-event.module.css';

export default function AddEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    ticketPrice: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debugger;
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
          return;
        }
        
        videoUrl = videoData.videoUrl;
      }

      // Step 3: Create event with the image URL and optional video URL
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        ticketPrice: parseFloat(formData.ticketPrice),
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
        // Redirect to events page after successful creation
        router.push('/events');
      } else {
        setError(eventData.error);
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
      // Create preview URL
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
      
      // Check file size (limit to 100MB for video)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setError('Video file size must be less than 100MB');
        return;
      }
      
      setSelectedVideo(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.addEventPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Add New Event</h1>
        <p className={styles.pageDescription}>
          Create a new event for Tonelab Studio
        </p>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.eventForm}>
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
              rows={4}
              required
              maxLength={1000}
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
            <label htmlFor="ticketPrice" className={styles.label}>
              Ticket Price ($) *
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className={styles.input}
              step="0.01"
              min="0"
              required
            />
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
                <img src={imagePreview} alt="Preview" />
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
            <button
              type="button"
              onClick={() => router.push('/events')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 