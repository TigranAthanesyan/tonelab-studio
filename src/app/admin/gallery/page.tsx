"use client";

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../events/events.module.css';

export default function AdminGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
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
          <h2 className={styles.pageTitle}>Gallery Management</h2>
        </div>

        <div className={styles.eventsGrid}>
          <Link href="/admin/gallery/photos" className={styles.galleryCard}>
            <div className={styles.galleryCardContent}>
              <h3>📸 Manage Photos</h3>
              <p>Add, edit, or remove photos from the gallery</p>
            </div>
          </Link>

          <Link href="/admin/gallery/videos" className={styles.galleryCard}>
            <div className={styles.galleryCardContent}>
              <h3>🎬 Manage Videos</h3>
              <p>Add, edit, or remove YouTube videos from the gallery</p>
            </div>
          </Link>

          <Link href="/admin/events" className={styles.galleryCard}>
            <div className={styles.galleryCardContent}>
              <h3>🎫 Manage Events</h3>
              <p>View and manage all events</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
