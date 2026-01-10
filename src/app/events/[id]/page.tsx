"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./event-page.module.css";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  ticketUrl: string;
  imageUrl: string;
  videoUrl?: string;
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setError(data.error || "Event not found");
      }
    } catch {
      setError("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (loading) {
    return (
      <div className={styles.eventPage}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.eventPage}>
        <div className={styles.error}>
          <h1>Event Not Found</h1>
          <p>{error || "The event you're looking for doesn't exist."}</p>
          <Link href="/events" className={styles.backButton}>
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const { full: fullDate, time } = formatDate(event.date);

  return (
    <div className={styles.eventPage}>
      <Link href="/events" className={styles.backLink}>
        ← Back to Events
      </Link>
      
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          {event.videoUrl ? (
            <video
              src={event.videoUrl}
              poster={event.imageUrl}
              controls
              autoPlay
              muted
              loop
              className={styles.heroMedia}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              sizes="100vw"
              className={styles.heroMedia}
            />
          )}
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.eventTitle}>{event.title}</h1>
            <div className={styles.eventMeta}>
              <div className={styles.metaItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{fullDate}</span>
              </div>
              <div className={styles.metaItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{time}</span>
              </div>
            </div>
            <a 
              href={event.ticketUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.ticketButton}
            >
              Get Tickets
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.contentSection}>
        <div className={styles.descriptionBox}>
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>
        
        {event.videoUrl && (
          <div className={styles.videoNote}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Video preview available</span>
          </div>
        )}
      </div>
    </div>
  );
} 