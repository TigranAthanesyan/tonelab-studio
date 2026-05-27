"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GalleryCarousel from "@/components/GalleryCarousel";
import Lightbox from "@/components/Lightbox";
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

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [videoIndex, setVideoIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [photosRes, videosRes] = await Promise.all([
          fetch("/api/gallery/photos"),
          fetch("/api/gallery/videos")
        ]);
        const photosData = await photosRes.json();
        const videosData = await videosRes.json();
        if (photosData.success) setPhotos(photosData.data);
        if (videosData.success) setVideos(videosData.data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openPhoto = (i: number) => setPhotoIndex(i);
  const closePhoto = () => setPhotoIndex(null);
  const prevPhoto = () => setPhotoIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  const nextPhoto = () =>
    setPhotoIndex((i) => (i === null ? null : Math.min(photos.length - 1, i + 1)));

  const openVideo = (i: number) => setVideoIndex(i);
  const closeVideo = () => setVideoIndex(null);
  const prevVideo = () => setVideoIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  const nextVideo = () =>
    setVideoIndex((i) => (i === null ? null : Math.min(videos.length - 1, i + 1)));

  const activePhoto = photoIndex !== null ? photos[photoIndex] : null;
  const activeVideo = videoIndex !== null ? videos[videoIndex] : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Gallery</h1>
          <p className={styles.pageSubtitle}>
            Photos and videos from our events and performances.
          </p>
        </header>

        {loading ? (
          <div className={styles.loading}>Loading gallery…</div>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Photos</h2>
              {photos.length === 0 ? (
                <p className={styles.emptyState}>No photos yet.</p>
              ) : (
                <GalleryCarousel
                  items={photos}
                  ariaLabel="Photos"
                  getKey={(p) => p._id}
                  renderItem={(p, i) => (
                    <button
                      type="button"
                      className={styles.photoCard}
                      onClick={() => openPhoto(i)}
                      aria-label={`Open photo${p.description ? `: ${p.description}` : ""}`}
                    >
                      <div className={styles.photoThumb}>
                        <Image
                          src={p.imageUrl}
                          alt={p.description || "Gallery photo"}
                          fill
                          sizes="(max-width: 768px) 90vw, 33vw"
                          className={styles.photoImage}
                        />
                      </div>
                      {p.description && (
                        <p className={styles.photoCaption}>{p.description}</p>
                      )}
                    </button>
                  )}
                />
              )}
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Videos</h2>
              {videos.length === 0 ? (
                <p className={styles.emptyState}>No videos yet.</p>
              ) : (
                <GalleryCarousel
                  items={videos}
                  ariaLabel="Videos"
                  getKey={(v) => v._id}
                  renderItem={(v, i) => (
                    <button
                      type="button"
                      className={styles.videoCard}
                      onClick={() => openVideo(i)}
                      aria-label={`Play video: ${v.title}`}
                    >
                      <div className={styles.videoThumb}>
                        <Image
                          src={v.thumbnailUrl}
                          alt={v.title}
                          fill
                          sizes="(max-width: 768px) 90vw, 33vw"
                          className={styles.videoImage}
                          unoptimized
                        />
                        <span className={styles.playIcon} aria-hidden="true">▶</span>
                      </div>
                      <p className={styles.videoTitle}>{v.title}</p>
                    </button>
                  )}
                />
              )}
            </section>
          </>
        )}
      </div>

      <Lightbox
        isOpen={activePhoto !== null}
        onClose={closePhoto}
        onPrev={prevPhoto}
        onNext={nextPhoto}
        hasPrev={photoIndex !== null && photoIndex > 0}
        hasNext={photoIndex !== null && photoIndex < photos.length - 1}
        ariaLabel="Photo fullscreen view"
      >
        {activePhoto && (
          <div className={styles.lightboxPhoto}>
            <div className={styles.lightboxImageWrap}>
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.description || "Gallery photo"}
                fill
                sizes="95vw"
                className={styles.lightboxImage}
                priority
              />
            </div>
            {activePhoto.description && (
              <p className={styles.lightboxCaption}>{activePhoto.description}</p>
            )}
          </div>
        )}
      </Lightbox>

      <Lightbox
        isOpen={activeVideo !== null}
        onClose={closeVideo}
        onPrev={prevVideo}
        onNext={nextVideo}
        hasPrev={videoIndex !== null && videoIndex > 0}
        hasNext={videoIndex !== null && videoIndex < videos.length - 1}
        ariaLabel="Video fullscreen view"
      >
        {activeVideo && (
          <div className={styles.lightboxVideo}>
            <div className={styles.videoEmbedWrap}>
              <iframe
                key={activeVideo.youtubeId}
                className={styles.videoEmbed}
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className={styles.lightboxCaption}>{activeVideo.title}</p>
          </div>
        )}
      </Lightbox>
    </div>
  );
}
