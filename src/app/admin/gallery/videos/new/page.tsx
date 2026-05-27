"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../form.module.css";

export default function NewGalleryVideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    router.push("/admin/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gallery/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() })
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/gallery");
      } else {
        setError(data.error || "Failed to add video");
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to add video: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin/gallery" className={styles.backLink}>
            ← Back to Gallery
          </Link>
          <h1 className={styles.title}>Add Gallery Video</h1>
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
              The title and thumbnail are fetched automatically from YouTube. Supported formats: watch?v=, youtu.be/, shorts/, embed/.
            </small>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/gallery" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Saving…" : "Add Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
