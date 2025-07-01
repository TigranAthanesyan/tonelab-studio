"use client";

import { useEffect, useState } from "react";
import styles from "../app/events/events.module.css";
import Image from "next/image";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  ticketPrice: number;
  imageUrl: string;
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
        <h1 className={styles.pageTitle}>Upcoming Events</h1>
        <p className={styles.pageDescription}>
          Join us for exciting performances, workshops, and musical gatherings at Tonelab Studio.
        </p>
        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  <Image
                    src={event.imageUrl} 
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200/cccccc/666666?text=No+Image';
                    }}
                  />
                </div>
                <div className={styles.eventDate}>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span className={styles.eventTime}>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={styles.eventInfo}>
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Price: ${event.ticketPrice.toFixed(2)}</span>
                  </div>
                  {/* You can add a "Get Tickets" button here if needed */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 