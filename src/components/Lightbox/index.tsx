"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./Lightbox.module.css";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  ariaLabel?: string;
}

export default function Lightbox({
  isOpen,
  onClose,
  children,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  ariaLabel = "Fullscreen view"
}: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext && hasNext) onNext();
    };

    document.addEventListener("keydown", onKey);

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {onPrev && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.navPrev}`}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={!hasPrev}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      {onNext && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.navNext}`}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={!hasNext}
          aria-label="Next"
        >
          ›
        </button>
      )}
    </div>
  );
}
