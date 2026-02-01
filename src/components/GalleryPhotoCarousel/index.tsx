'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './GalleryPhotoCarousel.module.css';

interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  description: string;
}

interface GalleryPhotoCarouselProps {
  photos: GalleryPhoto[];
  autoPlay?: boolean;
  interval?: number;
}

export default function GalleryPhotoCarousel({
  photos,
  autoPlay = true,
  interval = 5000,
}: GalleryPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || photos.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, goToNext, photos.length]);

  if (photos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No photos available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageContainer}>
        {photos.map((photo, index) => (
          <div
            key={photo._id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.description || `Gallery image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            {photo.description && (
              <div className={styles.description}>
                <p>{photo.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.prevArrow}`}
            onClick={goToPrev}
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.nextArrow}`}
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {photos.length > 1 && (
        <div className={styles.dots}>
          {photos.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
