'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './BackgroundSlideshow.module.css';

// Gallery images from public/gallery/
// These are referenced as public URLs, not imported into JS bundles
const GALLERY_IMAGES = [
  '/gallery/20251130_Petlia_125.jpg',
  '/gallery/DSC_8705.jpg',
  '/gallery/Tonelab 1st Anniversary celebration.JPG',
];

// Configuration
const ROTATION_INTERVAL = 15000; // 15 seconds between images
const FADE_DURATION = 1500; // 1.5 second fade transition

// Fisher-Yates shuffle for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function BackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imageOrder, setImageOrder] = useState<string[]>(GALLERY_IMAGES);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Shuffle images on initial load for variety
  useEffect(() => {
    setImageOrder(shuffleArray(GALLERY_IMAGES));
  }, []);

  // Preload all images once on mount
  useEffect(() => {
    imageOrder.forEach(src => {
      if (preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      
      const img = new Image();
      img.src = src;
    });
  }, [imageOrder]);

  // Handle rotation timer
  useEffect(() => {
    // Don't rotate if user prefers reduced motion or only one image
    if (prefersReducedMotion || imageOrder.length <= 1) {
      return;
    }

    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      
      // Calculate next indices (avoid immediate repeats via shuffled order)
      const nextIdx = (currentIndex + 1) % imageOrder.length;
      const upcomingIdx = (nextIdx + 1) % imageOrder.length;
      
      setNextIndex(nextIdx);
      
      // After transition completes, swap layers
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setNextIndex(upcomingIdx);
        setIsTransitioning(false);
      }, FADE_DURATION);
      
    }, ROTATION_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, imageOrder.length, prefersReducedMotion]);

  // Don't render if no images
  if (imageOrder.length === 0) {
    return null;
  }

  const currentImage = imageOrder[currentIndex];
  const nextImage = imageOrder[nextIndex];

  return (
    <div 
      className={styles.slideshowContainer}
      aria-hidden="true"
      role="presentation"
    >
      {/* Current image layer */}
      <div
        className={`${styles.imageLayer} ${isTransitioning ? styles.fadeOut : ''}`}
        style={{
          backgroundImage: `url("${currentImage}")`,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      />
      
      {/* Next image layer (underneath, revealed during transition) */}
      <div
        className={styles.imageLayer}
        style={{
          backgroundImage: `url("${nextImage}")`,
        }}
      />
      
      {/* Dark overlay for readability */}
      <div className={styles.overlay} />
    </div>
  );
}
