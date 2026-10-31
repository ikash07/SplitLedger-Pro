import React from 'react';

/**
 * Avatar Component
 * Demonstrates: Dynamic Inline Styles (dynamic gradient, size calculation, border)
 */
export const Avatar = ({
  name = 'User',
  color = '#6366F1',
  size = 36,
  showBorder = false,
  className = '',
  style = {}
}) => {
  // Extract initials (e.g. "Joy" -> "J", "Priya Sharma" -> "PS")
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  // Dynamic inline styling for gradient and dimensions
  const dynamicStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(color, -25)} 100%)`,
    color: '#ffffff',
    fontSize: `${Math.max(11, Math.floor(size * 0.38))}px`,
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    letterSpacing: '0.01em',
    userSelect: 'none',
    boxShadow: `0 3px 8px ${color}50, 0 1px 2px rgba(0,0,0,0.1)`,
    border: '2px solid rgba(255, 255, 255, 0.75)',
    ...style
  };

  return (
    <div 
      className={`avatar-circle ${className}`} 
      style={dynamicStyle}
      title={name}
    >
      {initials}
    </div>
  );
};

// Helper for dynamic shade calculations
function adjustColorBrightness(hex, percent) {
  if (!hex || hex[0] !== '#') return hex;
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
