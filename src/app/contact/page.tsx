"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './contact.module.css';
import { venueConfig, getPhoneLink, getEmailLink, getMapsLink } from '@/config/venue';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <div className={styles.contactPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Contact Us</h1>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <h2>Address</h2>
              <p>{venueConfig.address.street}</p>
              <p>{venueConfig.address.city}, {venueConfig.address.country}</p>
              <p className={styles.nearbyInfo}>{venueConfig.address.nearby}</p>
              <a 
                href={getMapsLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                📍 Find us on Google Maps
              </a>
            </div>
            
            <div className={styles.infoItem}>
              <h2>Contact</h2>
              <p>
                <strong>Email:</strong>{' '}
                <a href={getEmailLink()} className={styles.contactLink}>
                  {venueConfig.email}
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href={getPhoneLink()} className={styles.contactLink}>
                  {venueConfig.phone}
                </a>
              </p>
            </div>
            
            <div className={styles.socialLinks}>
              <h2>Follow Us</h2>
              <div className={styles.socialIcons}>
                <a 
                  href={venueConfig.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className={styles.socialLink}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  Facebook
                </a>
                <a 
                  href={venueConfig.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className={styles.socialLink}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram
                </a>
                <a 
                  href={venueConfig.social.linktree} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Linktree"
                  className={styles.socialLink}
                >
                  🔗 All Links
                </a>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <h2>Get Tickets</h2>
              <a 
                href={venueConfig.tickets.venuePage} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.ticketsLink}
              >
                View all events on Show4me
              </a>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2>Send Us a Message</h2>
            {submitMessage ? (
              <div className={styles.successMessage}>{submitMessage}</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 