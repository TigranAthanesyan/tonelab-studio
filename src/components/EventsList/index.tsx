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
  ticketPrice: number;
  imageUrl: string;
  videoUrl?: string; // Optional video URL
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
        setEvents(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.eventsPage}><div className="container">Loading events...</div></div>;
  }

  if (error) {
    return <div className={styles.eventsPage}><div className="container text-red-600">{error}</div></div>;
  }

  return (
    <div className={styles.eventsPage}>
      <div className="container">
        {/* <h1 className={styles.pageTitle}>Upcoming Events</h1>
        <p className={styles.pageDescription}>
          Join us for exciting performances, workshops, and musical gatherings at Tonelab Studio.
        </p> */}
        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            events.map((event) => (
              <Link key={event._id} href={`/events/${event._id}`} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  {event.videoUrl ? (
                    <div className={styles.videoContainer}>
                      <video 
                        src={event.videoUrl} 
                        poster={event.imageUrl}
                        muted
                        loop
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <Image
                      src={event.imageUrl} 
                      alt={event.title}
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                </div>
                <div className={styles.eventDate}>
                  <span>{new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className={styles.eventInfo}>
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Price: ${event.ticketPrice.toFixed(2)}</span>
                    {event.videoUrl && (
                      <span className="ml-2 text-blue-500">📹 Video available</span>
                    )}
                  </div>
                  {/* You can add a "Get Tickets" button here if needed */}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 