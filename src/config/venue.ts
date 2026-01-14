/**
 * Centralized venue information for ToneLab Studio
 * This config contains all official venue details used across the website
 */

export const venueConfig = {
  // Basic Information
  name: "ToneLab Studio",
  shortDescription: "Music venue, studio and school in the heart of Yerevan.",
  tagline: "Yerevan's Premier Music Space",
  
  // Location
  address: {
    full: "Koryun St 19A/35, Yerevan, Armenia",
    street: "Koryun St 19A/35",
    city: "Yerevan",
    country: "Armenia",
    nearby: "Near Yeritasardakan metro",
  },
  
  // Contact
  phone: "+374 98 607475",
  email: "tonelab.armenia@gmail.com",
  
  // Social Media
  social: {
    instagram: "https://www.instagram.com/tonelab_studio/",
    facebook: "https://www.facebook.com/100091266667959/",
    linktree: "https://linktr.ee/tonelab.armenia",
  },
  
  // Ticketing & Venue Pages
  tickets: {
    venuePage: "https://show4me.com/festivals/tonelab",
    aboutPage: "https://show4me.com/festivals/tonelab/about",
  },
  
  // Google Maps
  maps: {
    searchUrl: "https://www.google.com/maps/search/?api=1&query=Koryun+St+19A%2F35%2C+Yerevan%2C+Armenia",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.8943234567890!2d44.5144!3d40.1817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEwJzU0LjEiTiA0NMKwMzAnNTEuOCJF!5e0!3m2!1sen!2sam!4v1234567890",
  },
} as const;

// Helper functions for formatted output
export const getFullAddress = () => venueConfig.address.full;
export const getPhoneLink = () => `tel:${venueConfig.phone}`;
export const getEmailLink = () => `mailto:${venueConfig.email}`;
export const getMapsLink = () => venueConfig.maps.searchUrl;
