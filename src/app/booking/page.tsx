"use client";

import styles from './booking.module.css';
import { venueConfig } from '@/config/venue';
import Button from '@/components/ui/Button';
import ImageCarousel from '@/components/ImageCarousel';

// Lesson images from public/lessons
const LESSON_IMAGES = [
  '/lessons/D44A9180.JPG',
  '/lessons/D44A9191.JPG',
  '/lessons/D44A9224.JPG',
  '/lessons/D44A9255.JPG',
  '/lessons/D44A9267.JPG',
];

type Lesson = {
  id: number;
  title: string;
  description: string;
  levels: string;
  pricing: {
    monthly?: string;
    weekly?: string;
    single?: string;
  };
  isPlaceholder?: boolean;
};

export default function BookingPage() {
  const lessonTypes: Lesson[] = [
    {
      id: 1,
      title: 'Guitar Lessons',
      description: 'Learn acoustic, electric, or bass guitar with our experienced instructors.',
      levels: 'All levels',
      pricing: {
        monthly: '60,000 AMD (8 hours)',
        weekly: '40,000 AMD (4 hours)',
        single: '15,000 AMD (master class)'
      }
    },
    {
      id: 2,
      title: 'Songwriting',
      description: 'Learn the art of songwriting - from melody composition to lyrics.',
      levels: 'All levels',
      pricing: {
        monthly: '60,000 AMD (8 hours)',
        weekly: '40,000 AMD (4 hours)',
        single: '15,000 AMD (master class)'
      }
    },
    {
      id: 3,
      title: 'Drums',
      description: 'Master rhythm and percussion with our drum instructors.',
      levels: 'All levels',
      pricing: {
        monthly: 'Contact us for pricing',
      },
      isPlaceholder: true
    }
  ];

  return (
    <div className={styles.bookingPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Booking</h1>
        <p className={styles.pageDescription}>
          Book rehearsal space, music lessons, or organize your event at ToneLab Studio
        </p>

        {/* Rehearsal Section */}
        <section className={styles.bookingSection} id="rehearsal">
          <h2 className={styles.sectionTitle}>Rehearsal Space</h2>
          <p className={styles.sectionDescription}>
            Our fully equipped stage becomes a cozy, well-suited space for rehearsals and music practice on weekdays.
          </p>

          <div className={styles.contentBox}>
            <h3>What We Offer</h3>
            <ul className={styles.featuresList}>
              <li>Professional tech support throughout your stay</li>
              <li>Fully equipped stage with quality instruments and equipment</li>
              <li>Library lounge corner with drinks during breaks</li>
              <li>Cozy, well-suited environment for music practice</li>
            </ul>
          </div>

          <div className={styles.contentBox}>
            <h3>Monthly Subscription Plans</h3>
            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <h4>16 Hours a Month</h4>
                <p className={styles.price}>60,000 AMD</p>
                <ul>
                  <li>Twice a week</li>
                  <li>2 hours per day</li>
                </ul>
              </div>
              
              <div className={styles.pricingCard}>
                <h4>8 Hours per Month</h4>
                <p className={styles.price}>35,000 AMD</p>
                <ul>
                  <li>Once a week</li>
                  <li>2 hours per day</li>
                </ul>
              </div>
              
              <div className={styles.pricingCard}>
                <h4>Hourly Rent</h4>
                <p className={styles.price}>5,000 AMD</p>
                <ul>
                  <li>Two hour minimum</li>
                  <li>Flexible scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Section */}
        <section className={styles.bookingSection} id="lessons">
          <h2 className={styles.sectionTitle}>Music Lessons</h2>
          <p className={styles.sectionDescription}>
            Our educators have more than a decade of experience as professional musicians, so whether you&apos;re just starting out or looking to advance your skills, we&apos;ve got you covered.
          </p>

          <ImageCarousel images={LESSON_IMAGES} interval={6000} />

          <div className={styles.lessonsGrid}>
            {lessonTypes.map(lesson => (
              <div key={lesson.id} className={`${styles.lessonCard} ${lesson.isPlaceholder ? styles.placeholderCard : ''}`}>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                
                <div className={styles.lessonMeta}>
                  <div className={styles.levels}>
                    <h4>Skill Levels:</h4>
                    <p>{lesson.levels}</p>
                  </div>
                  
                  <div className={styles.pricing}>
                    <h4>Pricing:</h4>
                    {lesson.pricing.monthly && <p>Monthly course of 8 hours: {lesson.pricing.monthly}</p>}
                    {lesson.pricing.weekly && <p>Weekly course 4 hours: {lesson.pricing.weekly}</p>}
                    {lesson.pricing.single && <p>Single master class: {lesson.pricing.single}</p>}
                    {lesson.isPlaceholder && <p className={styles.placeholderText}>(To be confirmed)</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.otherCourses}>
            <h3>Looking for Other Instrument Courses?</h3>
            <p>Contact us and we&apos;ll tailor a program for you.</p>
          </div>
        </section>

        {/* Organizers Section */}
        <section className={styles.bookingSection} id="organizers">
          <h2 className={styles.sectionTitle}>For Event Organizers</h2>
          <p className={styles.sectionDescription}>
            Looking to host a concert, showcase, or music event? ToneLab Studio offers a professional venue with all the equipment and support you need.
          </p>

          <div className={styles.contentBox}>
            <h3>Venue Features</h3>
            <ul className={styles.featuresList}>
              <li>Professional stage with complete backline equipment</li>
              <li>High-quality sound system and lighting</li>
              <li>Experienced sound engineer support</li>
              <li>Intimate venue perfect for showcases and concerts</li>
              <li>Flexible booking options for various event types</li>
            </ul>
          </div>

          <div className={styles.contentBox}>
            <p className={styles.highlight}>
              Contact us to discuss your event needs, availability, and pricing. We&apos;ll work with you to make your event a success.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className={styles.ctaSection}>
          <h2>Ready to Book?</h2>
          <p>Contact us to reserve your slot or ask any questions.</p>
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
