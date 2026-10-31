import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
  fullWidth = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const composedClass = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={composedClass} {...rest}>
      {Icon ? <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2.1} /> : null}
      {children}
    </button>
  );
}
