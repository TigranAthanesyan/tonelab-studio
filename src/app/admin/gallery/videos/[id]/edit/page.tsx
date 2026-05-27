"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../../../form.module.css";

interface GalleryVideo {
  _id: string;
  youtubeId: string;
  originalUrl: string;
  title: string;
  thumbnailUrl: string;
}

export default function EditGalleryVideoPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [video, setVideo] = useState<GalleryVideo | null>(null);
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const res = await fetch(`/api/gallery/videos/${id}`);
        const data = await res.json();
        if (data.success) {
          setVideo(data.data);
          setUrl(data.data.originalUrl);
        } else {
          setError(data.error || "Failed to load video");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load video");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/gallery/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() })
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/gallery");
      } else {
        setError(data.error || "Failed to update video");
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to update video: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetching) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin/gallery" className={styles.backLink}>
            ← Back to Gallery
          </Link>
          <h1 className={styles.title}>Edit Gallery Video</h1>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="url" className={styles.label}>
              YouTube URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
              required
              placeholder="https://www.youtube.com/watch?v=…"
            />
            <small className={styles.helpText}>
              Changing the URL will re-fetch the title and thumbnail from YouTube.
            </small>
          </div>

          {video && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Current Video</label>
              <div className={styles.videoPreview}>
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width={320}
                  height={180}
                  unoptimized
                />
                <p className={styles.videoPreviewTitle}>{video.title}</p>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <Link href="/admin/gallery" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
