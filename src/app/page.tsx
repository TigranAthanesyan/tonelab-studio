import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { venueConfig } from "@/config/venue";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/logo.png"
            alt=""
            width={470}
            height={470}
            className={styles.backgroundLogo}
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1>{venueConfig.name.toUpperCase()}</h1>
          <p>{venueConfig.tagline}</p>
          <p className={styles.subtitle}>{venueConfig.subtitle}</p>
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
              <p>Experience live shows by local and international artists weekly - immersive sound, arena approach to the club.</p>
              <Link href="/events" className={styles.learnMoreLink}>Learn more →</Link>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Rehearsal Space</h3>
              <p>Our fully equipped stage becomes a cozy, well-suited space for rehearsals and music practice on weekdays.</p>
              <p>Professional tech support throughout your stay. Enjoy our library lounge corner with some drinks during a break.</p>
              <Link href="/rehearsal" className={styles.learnMoreLink}>Learn more →</Link>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Music Lessons</h3>
              <p>Our educators have more than a decade of experience as professional musicians, so whether you&apos;re just starting out or looking to advance your skills, we&apos;ve got you covered.</p>
              <Link href="/lessons" className={styles.learnMoreLink}>Learn more →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
