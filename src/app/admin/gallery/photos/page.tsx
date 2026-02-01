"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../events/events.module.css';

interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  description: string;
  order: number;
}

export default function AdminGalleryPhotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery/photos');
      const data = await response.json();
      
      if (data.success) {
        setPhotos(data.data);
      } else {
        setError('Failed to fetch photos');
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/gallery/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setPhotos([...photos, data.data]);
        setFormData({ imageUrl: '', description: '', order: 0 });
        setShowAddForm(false);
      } else {
        setError(data.error || 'Failed to add photo');
      }
    } catch (err) {
      console.error('Error adding photo:', err);
      setError('Failed to add photo');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await handleImageUpload(file);
        setFormData({ ...formData, imageUrl: url });
      } catch (err) {
        setError('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/photos/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setPhotos(photos.filter(photo => photo._id !== id));
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete photo');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo');
    }
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
            <h2 className={styles.pageTitle}>Gallery Photos</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={styles.createButton}
          >
            {showAddForm ? 'Cancel' : '+ Add Photo'}
          </button>
        </div>

        {showAddForm && (
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className={styles.input}
                />
                {formData.imageUrl && (
                  <div className={styles.imagePreview}>
                    <Image src={formData.imageUrl} alt="Preview" width={200} height={150} />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Add a description that will be shown over the photo..."
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
                disabled={uploading || !formData.imageUrl}
              >
                {uploading ? 'Uploading...' : 'Add Photo'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {photos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No photos yet. Add your first photo!</p>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {photos.map((photo) => (
              <div key={photo._id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <Image 
                    src={photo.imageUrl} 
                    alt={photo.description || 'Gallery photo'}
                    width={300}
                    height={200}
                    className={styles.eventImage}
                  />
                </div>
                <div className={styles.eventContent}>
                  <p className={styles.eventDescription}>
                    {photo.description || '(No description)'}
                  </p>
                  <p className={styles.eventDate}>Order: {photo.order}</p>
                  <div className={styles.eventActions}>
                    {deleteConfirm === photo._id ? (
                      <div className={styles.deleteConfirm}>
                        <span>Delete?</span>
                        <button 
                          onClick={() => handleDelete(photo._id)}
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
                        onClick={() => setDeleteConfirm(photo._id)}
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
