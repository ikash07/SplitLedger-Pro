import React from 'react';
import { Heart, Sparkles, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      style={{
        marginTop: '4rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.6)',
        padding: '2.5rem 0',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}
    >
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#f8fafc', fontSize: '1rem', marginBottom: '0.25rem' }}>
            <Sparkles size={16} color="#818CF8" /> SplitMate Expense Management System
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Built with React JS, Hooks, React Router, and Multi-Approach Styling (CSS Modules + Vanilla CSS + Dynamic Styles)
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-primary">map()</span>
          <span className="badge badge-primary">filter()</span>
          <span className="badge badge-primary">reduce()</span>
          <span className="badge badge-primary">sort()</span>
          <span className="badge badge-primary">some()</span>
          <span className="badge badge-primary">every()</span>
        </div>
      </div>
    </footer>
  );
};
