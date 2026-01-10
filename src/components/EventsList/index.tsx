"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  ticketUrl: string;
  imageUrl: string;
  videoUrl?: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success) {
        // Sort events by date (upcoming first)
        const sortedEvents = data.data.sort((a: Event, b: Event) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEvents(sortedEvents);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  if (loading) {
    return (
      <div className={styles.eventsPage}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.eventsPage}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Upcoming Shows</h1>
        <p className={styles.pageSubtitle}>
          Live music events at Yerevan&apos;s premier venue
        </p>
      </div>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No upcoming events. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((event) => {
            const { month, day } = formatDate(event.date);
            return (
              <Link key={event._id} href={`/events/${event._id}`} className={styles.eventCard}>
                <div className={styles.eventImageWrapper}>
                  {event.videoUrl ? (
                    <video 
                      src={event.videoUrl} 
                      poster={event.imageUrl}
                      muted
                      loop
                      className={styles.eventMedia}
                    />
                  ) : (
                    <Image
                      src={event.imageUrl} 
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.eventMedia}
                    />
                  )}
                  <div className={styles.dateBadge}>
                    <span className={styles.dateMonth}>{month}</span>
                    <span className={styles.dateDay}>{day}</span>
                  </div>
                </div>
                
                <div className={styles.eventContent}>
                  <h2 className={styles.eventTitle}>{event.title}</h2>
                  <p className={styles.eventDescription}>
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </p>
                  <div className={styles.eventFooter}>
                    <span className={styles.ticketCta}>Get Tickets →</span>
                    {event.videoUrl && (
                      <span className={styles.videoIndicator}>📹</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
} 