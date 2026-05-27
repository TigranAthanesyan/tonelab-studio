"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./GalleryCarousel.module.css";

interface GalleryCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  ariaLabel?: string;
  visibleDesktop?: number;
  visibleMobile?: number;
  mobileBreakpoint?: number;
}

export default function GalleryCarousel<T>({
  items,
  renderItem,
  getKey,
  ariaLabel = "Carousel",
  visibleDesktop = 3,
  visibleMobile = 1,
  mobileBreakpoint = 768
}: GalleryCarouselProps<T>) {
  const [visibleCount, setVisibleCount] = useState(visibleDesktop);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w < mobileBreakpoint ? visibleMobile : visibleDesktop);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [visibleDesktop, visibleMobile, mobileBreakpoint]);

  const maxIndex = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    setCurrentIndex((idx) => Math.min(idx, maxIndex));
  }, [maxIndex]);

  const pageCount = Math.max(1, Math.ceil(items.length / visibleCount));
  const activePage = Math.min(pageCount - 1, Math.floor(currentIndex / visibleCount));

  const trackStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translateX(calc(-1 * ${currentIndex} * (100% / var(--visible))))`,
      ["--visible" as string]: String(visibleCount),
    }),
    [currentIndex, visibleCount],
  );

  const slideStyle = useMemo<CSSProperties>(
    () => ({ ["--visible" as string]: String(visibleCount) }),
    [visibleCount],
  );

  const showArrows = items.length > visibleCount;
  const showDots = pageCount > 1;

  const goPrev = () => setCurrentIndex((idx) => Math.max(0, idx - 1));
  const goNext = () => setCurrentIndex((idx) => Math.min(maxIndex, idx + 1));
  const goToPage = (page: number) =>
    setCurrentIndex(Math.min(page * visibleCount, maxIndex));

  if (items.length === 0) return null;

  return (
    <div className={styles.carousel} aria-label={ariaLabel} role="region">
      {showArrows && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      <div className={styles.viewport}>
        <div className={styles.track} style={trackStyle}>
          {items.map((item, i) => (
            <div key={getKey(item, i)} className={styles.slide} style={slideStyle}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={goNext}
          disabled={currentIndex >= maxIndex}
          aria-label="Next"
        >
          ›
        </button>
      )}

      {showDots && (
        <div className={styles.dots} role="tablist" aria-label={`${ariaLabel} pages`}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === activePage ? styles.dotActive : ""}`}
              onClick={() => goToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-selected={i === activePage}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}
