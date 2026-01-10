import styles from "./page.module.css";
import Link from "next/link";
import { venueConfig } from "@/config/venue";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{venueConfig.name.toUpperCase()}</h1>
          <p>{venueConfig.tagline}</p>
          <div className={styles.heroCtas}>
            <Link href="/events" className={styles.primaryBtn}>
              Upcoming Events
            </Link>
            <Link href="/lessons" className={styles.secondaryBtn}>
              Book a Lesson
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Live Concerts</h3>
              <p>Experience amazing performances from local and international artists in our intimate venue.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Rehearsal Spaces</h3>
              <p>Professional studios equipped with high-quality instruments and equipment for musicians.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Music Lessons</h3>
              <p>Learn from experienced instructors in various instruments and musical styles.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Community Events</h3>
              <p>Join workshops, jams, and networking events for music enthusiasts and professionals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
