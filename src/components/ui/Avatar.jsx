import React from 'react';
import { getInitials } from '../../utils/formatters';

/* ==========================================================================
   STYLING APPROACH 4: Dynamic Inline JSX Style Objects
   Computes dimensions, member accent colors, and overlap offsets at runtime
   from component props.
   ========================================================================== */

const SIZE_PX = {
  xs: 24,
  sm: 30,
  md: 36,
  lg: 44,
};

export function Avatar({ name = 'User', color = '#0f766e', size = 'md', title }) {
  const dimension = SIZE_PX[size] || SIZE_PX.md;
  const fontSize = Math.round(dimension * 0.38);

  const inlineStyle = {
    width: `${dimension}px`,
    height: `${dimension}px`,
    borderRadius: '50%',
    backgroundColor: `${color}18`,
    color,
    border: `1.5px solid ${color}40`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: `${fontSize}px`,
    flexShrink: 0,
    letterSpacing: '0.02em',
    userSelect: 'none',
  };

  return (
    <span style={inlineStyle} title={title || name} aria-label={name}>
      {getInitials(name)}
    </span>
  );
}

export function AvatarStack({ members = [], size = 'sm', max = 5 }) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;
  const dimension = SIZE_PX[size] || SIZE_PX.sm;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((member, index) => (
        <div
          key={member.id}
          style={{
            marginLeft: index === 0 ? 0 : '-8px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            padding: '1.5px',
            display: 'inline-flex',
          }}
        >
          <Avatar
            name={member.name}
            color={member.color}
            size={size}
            title={member.name}
          />
        </div>
      ))}
      {overflow > 0 ? (
        <span
          style={{
            marginLeft: '-6px',
            width: `${dimension}px`,
            height: `${dimension}px`,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            border: '1.5px solid #cbd5e1',
            color: '#475569',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

export default Avatar;
