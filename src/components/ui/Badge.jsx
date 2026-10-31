import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children, tone = 'neutral', style }) {
  const toneClass = styles[tone] || styles.neutral;
  return (
    <span className={`${styles.badge} ${toneClass}`} style={style}>
      {children}
    </span>
  );
}
