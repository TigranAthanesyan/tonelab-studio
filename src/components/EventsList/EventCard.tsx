import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  ticketUrl: string;
  imageUrl: string;
  videoUrl?: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const month = date
    .toLocaleDateString("en-US", { month: "short", timeZone: "Asia/Yerevan" })
    .toUpperCase();
  const day = parseInt(
    date.toLocaleDateString("en-US", { day: "numeric", timeZone: "Asia/Yerevan" }),
    10,
  );
  return { month, day };
}

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const { month, day } = formatDate(event.date);
  return (
    <Link href={`/events/${event._id}`} className={styles.eventCard}>
      <div className={styles.eventImageWrapper}>
        {event.videoUrl ? (
          <video
            src={event.videoUrl}
            poster={event.imageUrl}
            muted
            loop
            className={styles.eventMedia}
          />
        ) : (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.eventMedia}
          />
        )}
        <div className={styles.dateBadge}>
          <span className={styles.dateMonth}>{month}</span>
          <span className={styles.dateDay}>{day}</span>
        </div>
      </div>

      <div className={styles.eventContent}>
        <h2 className={styles.eventTitle}>{event.title}</h2>
        <p className={styles.eventDescription}>
          {event.description.length > 100
            ? `${event.description.substring(0, 100)}...`
            : event.description}
        </p>
        <div className={styles.eventFooter}>
          <span className={styles.ticketCta}>Get Tickets →</span>
          {event.videoUrl && <span className={styles.videoIndicator}>📹</span>}
        </div>
      </div>
    </Link>
  );
}
