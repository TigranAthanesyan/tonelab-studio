"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../events/events.module.css';

interface GalleryVideo {
  _id: string;
  youtubeUrl: string;
  title: string;
  order: number;
}

export default function AdminGalleryVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    title: '',
    order: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/gallery/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.data);
      } else {
        setError('Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/gallery/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setVideos([...videos, data.data]);
        setFormData({ youtubeUrl: '', title: '', order: 0 });
        setShowAddForm(false);
      } else {
        setError(data.error || 'Failed to add video');
      }
    } catch (err) {
      console.error('Error adding video:', err);
      setError('Failed to add video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/videos/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setVideos(videos.filter(video => video._id !== id));
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      setError('Failed to delete video');
    }
  };

  const getVideoThumbnail = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    
    return '/placeholder.jpg';
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
          <div>
            <Link href="/admin/gallery" className={styles.backLink}>← Back to Gallery</Link>
            <h2 className={styles.pageTitle}>Gallery Videos</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={styles.createButton}
          >
            {showAddForm ? 'Cancel' : '+ Add Video'}
          </button>
        </div>

        {showAddForm && (
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="youtubeUrl">YouTube URL *</label>
                <input
                  type="url"
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className={styles.input}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="title">Title (optional)</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.input}
                  placeholder="Video title..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order">Order</label>
                <input
                  type="number"
                  id="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  className={styles.input}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={submitting || !formData.youtubeUrl}
              >
                {submitting ? 'Adding...' : 'Add Video'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {videos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No videos yet. Add your first video!</p>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {videos.map((video) => (
              <div key={video._id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <img 
                    src={getVideoThumbnail(video.youtubeUrl)} 
                    alt={video.title || 'YouTube video'}
                    className={styles.eventImage}
                  />
                </div>
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{video.title || '(No title)'}</h3>
                  <p className={styles.eventDescription}>
                    {video.youtubeUrl}
                  </p>
                  <p className={styles.eventDate}>Order: {video.order}</p>
                  <div className={styles.eventActions}>
                    {deleteConfirm === video._id ? (
                      <div className={styles.deleteConfirm}>
                        <span>Delete?</span>
                        <button 
                          onClick={() => handleDelete(video._id)}
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
                        onClick={() => setDeleteConfirm(video._id)}
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
