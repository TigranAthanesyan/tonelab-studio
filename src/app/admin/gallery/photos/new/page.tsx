"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../../form.module.css";

export default function NewGalleryPhotoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    router.push("/admin/login");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size === 0) {
      setError("Selected file is empty");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedImage) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("image", selectedImage);

      const upRes = await fetch("/api/upload-image", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upData.success) {
        setError(`Image upload failed: ${upData.error}`);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/gallery/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: upData.imageUrl,
          description: description.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/gallery");
      } else {
        setError(data.error || "Failed to create gallery photo");
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to create photo: ${err instanceof Error ? err.message : "Unknown error"}`);
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
          <h1 className={styles.title}>Add Gallery Photo</h1>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Photo *
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className={styles.fileInput}
              accept="image/*"
              required
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={350}
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Short Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
              maxLength={300}
              placeholder="A short caption shown below the photo"
            />
            <small className={styles.helpText}>
              Up to 300 characters. {description.length}/300
            </small>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/gallery" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Saving…" : "Add Photo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
