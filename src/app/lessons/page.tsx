"use client";

import styles from './lessons.module.css';
import { venueConfig } from '@/config/venue';

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

export default function LessonsPage() {
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
  
  const handleContactUs = () => {
    window.location.href = `/contact`;
  };

  return (
    <div className={styles.lessonsPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Music Lessons</h1>
        <p className={styles.pageDescription}>
          Our educators have more than a decade of experience as professional musicians, so whether you&apos;re just starting out or looking to advance your skills, we&apos;ve got you covered.
        </p>

        <div className={styles.lessonsList}>
          {lessonTypes.map(lesson => (
            <div key={lesson.id} className={`${styles.lessonCard} ${lesson.isPlaceholder ? styles.placeholderCard : ''}`}>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
              
              <div className={styles.lessonMeta}>
                <div className={styles.levels}>
                  <h3>Skill Levels:</h3>
                  <p>{lesson.levels}</p>
                </div>
                
                <div className={styles.pricing}>
                  <h3>Pricing:</h3>
                  {lesson.pricing.monthly && <p>Monthly course of 8 hours: {lesson.pricing.monthly}</p>}
                  {lesson.pricing.weekly && <p>Weekly course 4 hours: {lesson.pricing.weekly}</p>}
                  {lesson.pricing.single && <p>Single master class: {lesson.pricing.single}</p>}
                  {lesson.isPlaceholder && <p className={styles.placeholderText}>(To be confirmed)</p>}
                </div>
              </div>
              
              <button 
                className={styles.bookButton}
                onClick={handleContactUs}
              >
                Contact Us
              </button>
            </div>
          ))}
        </div>

        <div className={styles.otherCourses}>
          <h2>Looking for Other Instrument Courses?</h2>
          <p>Contact us and we&apos;ll tailor a program for you.</p>
          <a href={`tel:${venueConfig.phone}`} className={styles.contactButton}>
            Call Us: {venueConfig.phone}
          </a>
        </div>
      </div>
    </div>
  );
} 