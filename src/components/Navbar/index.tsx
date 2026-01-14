"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';
import { venueConfig } from '@/config/venue';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Lessons', path: '/lessons' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu} className={styles.logoLink}>
            <Image 
              src="/logo.png" 
              alt={venueConfig.name}
              width={50}
              height={50}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>
        
        <button 
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={isMenuOpen ? styles.hamburgerOpen : ''}></span>
          <span className={isMenuOpen ? styles.hamburgerOpen : ''}></span>
          <span className={isMenuOpen ? styles.hamburgerOpen : ''}></span>
        </button>
        
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          {routes.map((route) => (
            <li key={route.path}>
              <Link 
                href={route.path}
                className={pathname === route.path ? styles.active : ''}
                onClick={closeMenu}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 