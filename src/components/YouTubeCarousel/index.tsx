'use client';

import { useState, useCallback, useMemo } from 'react';
import styles from './YouTubeCarousel.module.css';

interface GalleryVideo {
  _id: string;
  youtubeUrl: string;
  title: string;
}

interface YouTubeCarouselProps {
  videos: GalleryVideo[];
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export default function YouTubeCarousel({ videos }: YouTubeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Memoize video ID extraction
  const currentVideo = videos[currentIndex];
  const videoId = useMemo(() => 
    currentVideo ? getYouTubeVideoId(currentVideo.youtubeUrl) : null,
    [currentVideo]
  );

  if (videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No videos available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.videoContainer}>
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={currentVideo.title || `Video ${currentIndex + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
          />
        ) : (
          <div className={styles.errorState}>
            <p>Invalid YouTube URL</p>
          </div>
        )}
        {currentVideo.title && (
          <div className={styles.title}>
            <h3>{currentVideo.title}</h3>
          </div>
        )}
      </div>

      {videos.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.prevArrow}`}
            onClick={goToPrev}
            aria-label="Previous video"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.nextArrow}`}
            onClick={goToNext}
            aria-label="Next video"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {videos.length > 1 && (
        <div className={styles.dots}>
          {videos.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
