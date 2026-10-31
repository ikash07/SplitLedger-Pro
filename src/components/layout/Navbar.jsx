import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Menu, 
  X,
  RotateCcw,
  Zap,
  Sparkles
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { PiggyIcon } from '../common/CustomIcons';
import { QuickAddModal } from '../expenses/QuickAddModal';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { 
    groups, 
    activeGroupId, 
    setActiveGroupId, 
    members,
    currentUserId,
    setCurrentUserId,
    currentUser, 
    resetToSampleData 
  } = useExpenses();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('piggysplit_theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('piggysplit_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Playful, super-clear navigation tabs
  const navItems = [
    { to: '/', label: 'Home', emoji: '🏠' },
    { to: '/expenses', label: 'Bills', emoji: '🍕' },
    { to: '/add-expense', label: 'Add Bill', emoji: '➕' },
    { to: '/settle', label: 'Pay Back', emoji: '🤝' },
    { to: '/groups', label: 'Friends', emoji: '👥' },
    { to: '/analytics', label: 'Stats', emoji: '📊' },
    { to: '/activity', label: 'History', emoji: '📜' }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.inner}>
            
            {/* Custom PiggySplit Brand Logo */}
            <Link to="/" className={styles.brand}>
              <PiggyIcon size={42} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ lineHeight: 1.1 }}>
                  Piggy<span style={{ color: 'var(--primary)' }}>Split</span>
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  🐷 SQUAD BILLS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with 3D Pills */}
            <nav className={styles.navLinks}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Action Controls */}
            <div className={styles.actions}>
              
              {/* Quick Split Big 3D Button */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setQuickAddOpen(true)}
                title="Add a bill in 3 seconds!"
              >
                <span>⚡</span>
                <span>+ Add Bill</span>
              </button>

              {/* Group Selector Dropdown */}
              <select
                value={activeGroupId}
                onChange={(e) => setActiveGroupId(e.target.value)}
                className={styles.selector}
                title="Switch squad or trip"
              >
                <option value="all">🌟 All Squads</option>
                {groups.map(grp => (
                  <option key={grp.id} value={grp.id}>
                    {grp.name}
                  </option>
                ))}
              </select>

              {/* Instant Character / Person Switcher */}
              <select
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className={styles.selector}
                title="Switch player: see what you owe or get back!"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    👤 {m.name}
                  </option>
                ))}
              </select>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                style={{ padding: '0.45rem 0.65rem' }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Reset Data Button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all bills back to sample start?')) {
                    resetToSampleData();
                  }
                }}
                className="btn btn-secondary btn-sm"
                title="Reset to fresh sample bills"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <QuickAddModal 
          isOpen={quickAddOpen} 
          onClose={() => setQuickAddOpen(false)} 
        />
      )}
    </>
  );
};
