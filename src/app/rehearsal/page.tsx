import styles from './rehearsal.module.css';
import Link from 'next/link';
import { venueConfig } from '@/config/venue';
import Button from '@/components/ui/Button';

export default function RehearsalPage() {
  return (
    <div className={styles.rehearsalPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Rehearsal Space</h1>
        <p className={styles.pageDescription}>
          Our fully equipped stage becomes a cozy, well-suited space for rehearsals and music practice on weekdays.
        </p>

        <section className={styles.section}>
          <h2>What We Offer</h2>
          <ul className={styles.featuresList}>
            <li>Professional tech support throughout your stay</li>
            <li>Fully equipped stage with quality instruments and equipment</li>
            <li>Library lounge corner with drinks during breaks</li>
            <li>Cozy, well-suited environment for music practice</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Monthly Subscription Plans</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>16 Hours a Month</h3>
              <p className={styles.price}>60,000 AMD</p>
              <ul>
                <li>Twice a week</li>
                <li>2 hours per day</li>
              </ul>
            </div>
            
            <div className={styles.pricingCard}>
              <h3>8 Hours per Month</h3>
              <p className={styles.price}>35,000 AMD</p>
              <ul>
                <li>Once a week</li>
                <li>2 hours per day</li>
              </ul>
            </div>
            
            <div className={styles.pricingCard}>
              <h3>Hourly Rent</h3>
              <p className={styles.price}>5,000 AMD</p>
              <ul>
                <li>Two hour minimum</li>
                <li>Flexible scheduling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Ready to Book?</h2>
          <p>Contact us to reserve your rehearsal time or ask any questions.</p>
          <div className={styles.ctaButtons}>
            <Button asLink href={`tel:${venueConfig.phone}`} variant="primary" size="lg">
              Call Us: {venueConfig.phone}
            </Button>
            <Button asLink href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
