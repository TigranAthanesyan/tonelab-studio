"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./gallery.module.css";

interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  description?: string;
}

interface GalleryVideo {
  _id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
}

type DeleteTarget = { type: "photo" | "video"; id: string } | null;

export default function AdminGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteTarget>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const [pRes, vRes] = await Promise.all([
          fetch("/api/gallery/photos"),
          fetch("/api/gallery/videos")
        ]);
        const pData = await pRes.json();
        const vData = await vRes.json();
        if (pData.success) setPhotos(pData.data);
        if (vData.success) setVideos(vData.data);
        if (!pData.success || !vData.success) {
          setError("Failed to load some gallery items");
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const handleDeletePhoto = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/photos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPhotos((prev) => prev.filter((p) => p._id !== id));
        setDeleteConfirm(null);
      } else {
        setError(data.error || "Failed to delete photo");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete photo");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/videos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => prev.filter((v) => v._id !== id));
        setDeleteConfirm(null);
      } else {
        setError(data.error || "Failed to delete video");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete video");
    }
  };

  if (status === "loading" || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.headerActions}>
            <Link href="/admin/events" className={styles.navLink}>Events</Link>
            <span className={styles.userEmail}>{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.pageHeading}>Gallery Management</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Photos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Photos</h3>
            <Link href="/admin/gallery/photos/new" className={styles.createButton}>
              + Add Photo
            </Link>
          </div>

          {photos.length === 0 ? (
            <div className={styles.emptyState}>No photos yet.</div>
          ) : (
            <div className={styles.grid}>
              {photos.map((p) => (
                <div key={p._id} className={styles.card}>
                  <div className={styles.thumb}>
                    <Image
                      src={p.imageUrl}
                      alt={p.description || "Gallery photo"}
                      width={320}
                      height={200}
                      className={styles.thumbImage}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.caption}>
                      {p.description
                        ? p.description.length > 100
                          ? `${p.description.substring(0, 100)}…`
                          : p.description
                        : <em>No description</em>}
                    </p>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/gallery/photos/${p._id}/edit`}
                        className={styles.editButton}
                      >
                        Edit
                      </Link>
                      {deleteConfirm?.type === "photo" && deleteConfirm.id === p._id ? (
                        <div className={styles.deleteConfirm}>
                          <span>Delete?</span>
                          <button
                            onClick={() => handleDeletePhoto(p._id)}
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
                          onClick={() => setDeleteConfirm({ type: "photo", id: p._id })}
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
        </section>

        {/* Videos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Videos</h3>
            <Link href="/admin/gallery/videos/new" className={styles.createButton}>
              + Add Video
            </Link>
          </div>

          {videos.length === 0 ? (
            <div className={styles.emptyState}>No videos yet.</div>
          ) : (
            <div className={styles.grid}>
              {videos.map((v) => (
                <div key={v._id} className={styles.card}>
                  <div className={styles.thumb}>
                    <Image
                      src={v.thumbnailUrl}
                      alt={v.title}
                      width={320}
                      height={200}
                      className={styles.thumbImage}
                      unoptimized
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.videoTitle}>{v.title}</p>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/gallery/videos/${v._id}/edit`}
                        className={styles.editButton}
                      >
                        Edit
                      </Link>
                      {deleteConfirm?.type === "video" && deleteConfirm.id === v._id ? (
                        <div className={styles.deleteConfirm}>
                          <span>Delete?</span>
                          <button
                            onClick={() => handleDeleteVideo(v._id)}
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
                          onClick={() => setDeleteConfirm({ type: "video", id: v._id })}
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
        </section>
      </div>
    </div>
  );
}
