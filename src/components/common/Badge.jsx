import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  icon: Icon,
  color,
  bgColor,
  className = '',
  style = {}
}) => {
  // If custom color is passed, use dynamic inline style
  const customStyle = color ? {
    backgroundColor: bgColor || `${color}20`,
    color: color,
    borderColor: `${color}40`,
    ...style
  } : style;

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={customStyle}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
