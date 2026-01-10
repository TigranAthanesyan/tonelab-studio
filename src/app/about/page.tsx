import styles from './about.module.css';
import { venueConfig } from '@/config/venue';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>About {venueConfig.name}</h1>
        
        <section className={styles.section}>
          <h2>Who We Are</h2>
          <p>
            {venueConfig.shortDescription}
          </p>
          <p>
            Our mission is to foster musical talent, provide high-quality resources for artists, and create memorable musical experiences for our community.
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Our Facilities</h2>
          <div className={styles.facilitiesGrid}>
            <div className={styles.facilityCard}>
              <h3>Concert Venue</h3>
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
        </section>

        <section className={styles.section}>
          <h2>Find Us</h2>
          <div className={styles.locationInfo}>
            <div className={styles.addressBlock}>
              <h3>Address</h3>
              <p>{venueConfig.address.full}</p>
              <p className={styles.nearbyInfo}>{venueConfig.address.nearby}</p>
              <a 
                href={venueConfig.maps.searchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.directionsLink}
              >
                Get Directions →
              </a>
            </div>
            <div className={styles.mapContainer}>
              <iframe
                src={venueConfig.maps.embedUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ToneLab Studio Location"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 