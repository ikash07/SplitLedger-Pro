import React from 'react';
import styles from './Card.module.css';

const PADDING_MAP = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
};

export function Card({
  children,
  padding = 'md',
  interactive = false,
  className = '',
  style,
  onClick,
}) {
  const classes = [
    styles.card,
    PADDING_MAP[padding] || styles.padMd,
    interactive ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default Card;
