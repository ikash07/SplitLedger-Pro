import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  actions,
  style,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`glass-panel ${glow ? 'card-glow' : ''} ${className}`}
      style={{
        padding: '1.5rem',
        position: 'relative',
        ...style
      }}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.85rem'
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
