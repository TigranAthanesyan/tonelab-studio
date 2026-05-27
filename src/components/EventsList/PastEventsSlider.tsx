"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import styles from "./PastEventsSlider.module.css";
import { EventCard, type EventItem } from "./EventCard";

interface PastEventsSliderProps {
  events: EventItem[];
}

const MOBILE_BREAKPOINT = 768;

function getVisibleCount(width: number): number {
  return width < MOBILE_BREAKPOINT ? 1 : 3;
}

export default function PastEventsSlider({ events }: PastEventsSliderProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, events.length - visibleCount);

  // Clamp current index when visibleCount or events change.
  useEffect(() => {
    setCurrentIndex((idx) => Math.min(idx, maxIndex));
  }, [maxIndex]);

  const pageCount = Math.max(1, Math.ceil(events.length / visibleCount));
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

  const showArrows = events.length > visibleCount;
  const showDots = pageCount > 1;

  const goPrev = () => setCurrentIndex((idx) => Math.max(0, idx - 1));
  const goNext = () => setCurrentIndex((idx) => Math.min(maxIndex, idx + 1));
  const goToPage = (page: number) =>
    setCurrentIndex(Math.min(page * visibleCount, maxIndex));

  if (events.length === 0) return null;

  return (
    <div className={styles.carousel}>
      {showArrows && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous past events"
        >
          ‹
        </button>
      )}

      <div className={styles.viewport}>
        <div className={styles.track} style={trackStyle}>
          {events.map((event) => (
            <div key={event._id} className={styles.slide} style={slideStyle}>
              <EventCard event={event} />
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
          aria-label="Next past events"
        >
          ›
        </button>
      )}

      {showDots && (
        <div className={styles.dots} role="tablist" aria-label="Past events pages">
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
