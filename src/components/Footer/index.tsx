"use client";

import styles from './styles.module.css';
import { venueConfig } from '@/config/venue';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{venueConfig.name.toUpperCase()}</h3>
            <p className={styles.footerText}>
              {venueConfig.shortDescription}
            </p>
            <address className={styles.footerAddress}>
              <p>{venueConfig.address.street}</p>
              <p>{venueConfig.address.city}, {venueConfig.address.country}</p>
            </address>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <nav className={styles.footerLinks}>
              <a href="/events">Events</a>
              <a href="/lessons">Lessons</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Visit Us</h4>
            <address className={styles.footerAddress}>
              <p>{venueConfig.name}</p>
              <p>{venueConfig.address.street}</p>
              <p>{venueConfig.address.city}, {venueConfig.address.country}</p>
            </address>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href={venueConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href={venueConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} {venueConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
