"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './contact.module.css';

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
              <p>123 Music Street</p>
              <p>Yerevan, Armenia</p>
            </div>
            
            <div className={styles.infoItem}>
              <h2>Hours</h2>
              <p>Monday - Friday: 10:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 12:00 PM - 10:00 PM</p>
            </div>
            
            <div className={styles.infoItem}>
              <h2>Contact</h2>
              <p>Email: info@tonelabstudio.am</p>
              <p>Phone: +374 10 123456</p>
            </div>
            
            <div className={styles.socialLinks}>
              <h2>Follow Us</h2>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a>
              </div>
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