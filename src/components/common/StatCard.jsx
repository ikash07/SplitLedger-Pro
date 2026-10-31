import React from 'react';
import { Card } from './Card';

export const StatCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary', // 'primary', 'success', 'danger', 'cyan'
  trend,
  className = ''
}) => {
  const variantGradients = {
    primary: 'linear-gradient(135deg, rgba(255, 75, 114, 0.2) 0%, rgba(255, 101, 132, 0.1) 100%)',
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
    danger: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(225, 29, 72, 0.1) 100%)',
    cyan: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)'
  };

  const iconColors = {
    primary: '#FF4B72',
    success: '#10B981',
    danger: '#F43F5E',
    cyan: '#3B82F6'
  };

  return (
    <Card className={`stat-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            {value}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: variantGradients[variant] || variantGradients.primary,
              color: iconColors[variant] || iconColors.primary,
              border: `1px solid ${iconColors[variant]}30`,
              boxShadow: `0 4px 12px ${iconColors[variant]}25`
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
      {trend && (
        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          {trend}
        </div>
      )}
    </Card>
  );
};
