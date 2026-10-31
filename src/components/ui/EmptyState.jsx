import React from 'react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '38px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-strong)',
        backgroundColor: '#f8fafc',
        gap: '10px',
      }}
    >
      {Icon ? (
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            color: 'var(--brand-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Icon size={21} />
        </div>
      ) : null}
      <h4 style={{ fontSize: '0.975rem', fontWeight: 700 }}>{title}</h4>
      {description ? (
        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
          }}
        >
          {description}
        </p>
      ) : null}
      {action ? <div style={{ marginTop: '6px' }}>{action}</div> : null}
    </div>
  );
}
