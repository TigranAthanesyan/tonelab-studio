"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { EventCard, type EventItem } from "./EventCard";
import PastEventsSlider from "./PastEventsSlider";
import { yerevanDateKey } from "@/lib/time";

export default function EventsList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    setTodayKey(yerevanDateKey(new Date()));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.success) {
          setEvents(data.data as EventItem[]);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!todayKey) {
      return { upcomingEvents: [] as EventItem[], pastEvents: [] as EventItem[] };
    }
    const upcoming: EventItem[] = [];
    const past: EventItem[] = [];
    for (const event of events) {
      const key = yerevanDateKey(new Date(event.date));
      if (key >= todayKey) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    }
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events, todayKey]);

  if (loading || todayKey === null) {
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
        <p className={styles.pageSubtitle}>Live music events at ToneLab Studio</p>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No upcoming events. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {pastEvents.length > 0 && (
        <section className={styles.pastSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Past Shows</h2>
            <p className={styles.sectionSubtitle}>A look back at recent nights</p>
          </div>
          <PastEventsSlider events={pastEvents} />
        </section>
      )}
    </div>
  );
}
