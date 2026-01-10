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
  videoUrl?: string; // Optional video URL
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

  if (loading) {
    return (
      <div className={styles.eventPage}>
        <div className="container">
          <div className={styles.loading}>Loading event...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.eventPage}>
        <div className="container">
          <div className={styles.error}>
            <h1>Event Not Found</h1>
            <p>{error || "The event you're looking for doesn't exist."}</p>
            <Link href="/events" className={styles.backLink}>
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventPage}>
      <div className="container">
        <Link href="/events" className={styles.backLink}>
          ← Back to Events
        </Link>
        
        <div className={styles.eventContainer}>
          <div className={styles.eventImage}>
            {event.videoUrl ? (
              <div className={styles.videoContainer}>
                <video
                  src={event.videoUrl}
                  poster={event.imageUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  className={styles.mainVideo}
                >
                  Your browser does not support the video tag.
                </video>
                <div className={styles.videoOverlay}>
                  <span className={styles.videoIndicator}>📹 Event Video</span>
                </div>
              </div>
            ) : (
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={300}
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
          
          <div className={styles.eventDetails}>
            <h1 className={styles.eventTitle}>{event.title}</h1>
            
            <div className={styles.eventDate}>
              <span className={styles.dateLabel}>Date & Time:</span>
              <span className={styles.dateValue}>
                {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className={styles.eventDescription}>
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>
            
            <div className={styles.eventActions}>
              <a 
                href={event.ticketUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.bookButton}
              >
                Get Tickets
              </a>
              <button className={styles.shareButton}>
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 