import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'poster';
  className?: string;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  variant = 'default',
  className = '',
  onClick 
}: CardProps) {
  const classes = `${styles.card} ${styles[variant]} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
