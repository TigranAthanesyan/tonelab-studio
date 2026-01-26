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
        </section>
        
        <section className={styles.section}>
          <h2>Our Team</h2>
          <p>
            Tonelab Studio is run by a team of passionate musicians, sound engineers and educators with a mission to organize the full cycle of rock and alternative music production in Armenia.
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