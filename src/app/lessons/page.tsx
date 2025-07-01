"use client";

import styles from './lessons.module.css';

type Level = 'Beginner' | 'Intermediate' | 'Advanced';

type Lesson = {
  id: number;
  title: string;
  description: string;
  levels: Level[];
  price: string;
};

export default function LessonsPage() {
  // This would be fetched from an API or CMS in a real project
  const lessonTypes: Lesson[] = [
    {
      id: 1,
      title: 'Guitar Lessons',
      description: 'Learn acoustic, electric, or bass guitar with our experienced instructors.',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      price: '15,000 AMD per hour'
    },
    {
      id: 2,
      title: 'Piano Lessons',
      description: 'Classical, jazz, and contemporary piano instruction for all ages.',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      price: '18,000 AMD per hour'
    },
    {
      id: 3,
      title: 'Vocal Training',
      description: 'Develop your singing technique, range, and performance skills.',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      price: '20,000 AMD per hour'
    },
    {
      id: 4,
      title: 'Drum Lessons',
      description: 'Master rhythm and percussion with our drum instructors.',
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      price: '17,000 AMD per hour'
    }
  ];
  
  const handleBookLesson = (lessonId: number) => {
    const lesson = lessonTypes.find(l => l.id === lessonId);
    if (lesson) {
      // In a real app, this would open a modal or navigate to a booking page
      alert(`Booking a ${lesson.title} session. Price: ${lesson.price}`);
    }
  };

  return (
    <div className={styles.lessonsPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Music Lessons</h1>
        <p className={styles.pageDescription}>
          Whether you&apos;re just starting out or looking to advance your skills, our experienced instructors are here to help you grow as a musician.
        </p>

        <div className={styles.lessonsList}>
          {lessonTypes.map(lesson => (
            <div key={lesson.id} className={styles.lessonCard}>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
              
              <div className={styles.lessonMeta}>
                <div className={styles.levels}>
                  <h3>Skill Levels:</h3>
                  <ul>
                    {lesson.levels.map((level, index) => (
                      <li key={index}>{level}</li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.pricing}>
                  <h3>Pricing:</h3>
                  <p>{lesson.price}</p>
                </div>
              </div>
              
              <button 
                className={styles.bookButton}
                onClick={() => handleBookLesson(lesson.id)}
              >
                Book a Lesson
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 