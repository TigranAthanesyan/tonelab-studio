"use client";

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './events.module.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  ticketUrl: string;
  imageUrl: string;
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter(event => event._id !== id));
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.headerActions}>
            <span className={styles.userEmail}>{session.user?.email}</span>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className={styles.signOutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Events Management</h2>
          <Link href="/admin/events/new" className={styles.createButton}>
            + Create Event
          </Link>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <Image 
                    src={event.imageUrl} 
                    alt={event.title}
                    width={300}
                    height={200}
                    className={styles.eventImage}
                  />
                </div>
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDate}>{formatDate(event.date)}</p>
                  <p className={styles.eventDescription}>
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </p>
                  <div className={styles.eventActions}>
                    <Link 
                      href={`/admin/events/${event._id}/edit`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    {deleteConfirm === event._id ? (
                      <div className={styles.deleteConfirm}>
                        <span>Delete?</span>
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className={styles.confirmButton}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(null)}
                          className={styles.cancelButton}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirm(event._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
