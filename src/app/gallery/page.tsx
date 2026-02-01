"use client";

import { useState, useEffect } from 'react';
import styles from './gallery.module.css';
import GalleryPhotoCarousel from '@/components/GalleryPhotoCarousel';
import YouTubeCarousel from '@/components/YouTubeCarousel';

interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  description: string;
}

interface GalleryVideo {
  _id: string;
  youtubeUrl: string;
  title: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch photos
    fetch('/api/gallery/photos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPhotos(data.data);
        }
        setLoadingPhotos(false);
      })
      .catch(err => {
        console.error('Error fetching photos:', err);
        setError('Failed to load photos');
        setLoadingPhotos(false);
      });

    // Fetch videos
    fetch('/api/gallery/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVideos(data.data);
        }
        setLoadingVideos(false);
      })
      .catch(err => {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
        setLoadingVideos(false);
      });
  }, []);

  return (
    <div className={styles.galleryPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Gallery</h1>
        <p className={styles.pageDescription}>
          Relive the moments from our events and concerts through photos and videos
        </p>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <section className={styles.section}>
          <h2>Event Photos</h2>
          {loadingPhotos ? (
            <div className={styles.loading}>Loading photos...</div>
          ) : (
            <GalleryPhotoCarousel photos={photos} />
          )}
        </section>

        <section className={styles.section}>
          <h2>Concert Recordings</h2>
          {loadingVideos ? (
            <div className={styles.loading}>Loading videos...</div>
          ) : (
            <YouTubeCarousel videos={videos} />
          )}
        </section>
      </div>
    </div>
  );
}
