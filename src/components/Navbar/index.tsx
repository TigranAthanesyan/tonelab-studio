"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';

export default function Navbar() {
  const pathname = usePathname();
  
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Add Event', path: '/add-event' },
    { name: 'Lessons', path: '/lessons' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          TONELAB STUDIO
        </Link>
      </div>
      <ul className={styles.navLinks}>
        {routes.map((route) => (
          <li key={route.path}>
            <Link 
              href={route.path}
              className={pathname === route.path ? styles.active : ''}
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 