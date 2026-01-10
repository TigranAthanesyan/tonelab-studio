import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'date' | 'accent' | 'default';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: BadgeProps) {
  const classes = `${styles.badge} ${styles[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}
