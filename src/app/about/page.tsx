import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>About Tonelab Studio</h1>
        
        <section className={styles.section}>
          <h2>Our Story</h2>
          <p>
            Founded in 2020, Tonelab Studio emerged from a passion for music and a desire to create a vibrant community space for musicians and music lovers in Yerevan. What began as a small rehearsal space has grown into a comprehensive music center offering concerts, lessons, recording facilities, and more.
          </p>
          <p>
            Our mission is to foster musical talent, provide high-quality resources for artists, and create memorable musical experiences for our community.
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Our Facilities</h2>
          <div className={styles.facilitiesGrid}>
            <div className={styles.facilityCard}>
              <h3>Concert Venue</h3>x``
              <p>Intimate performance space with professional sound and lighting for up to 100 people.</p>
            </div>
            
            <div className={styles.facilityCard}>
              <h3>Rehearsal Rooms</h3>
              <p>Four fully equipped rehearsal rooms with drums, amplifiers, and PA systems.</p>
            </div>
            
            <div className={styles.facilityCard}>
              <h3>Recording Studio</h3>
              <p>Professional recording facilities with experienced sound engineers.</p>
            </div>
            
            <div className={styles.facilityCard}>
              <h3>Lesson Spaces</h3>
              <p>Private rooms for individual and group lessons with optimal acoustics.</p>
            </div>
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>Our Team</h2>
          <p>
            Tonelab Studio is run by a team of passionate musicians, sound engineers, and music educators dedicated to creating an exceptional experience for all visitors.
          </p>
          <div className={styles.teamMembers}>
            {/* Team members would go here in a real site */}
          </div>
        </section>
      </div>
    </div>
  );
} 