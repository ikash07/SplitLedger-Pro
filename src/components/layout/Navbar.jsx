import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  Scale, 
  Users, 
  PieChart, 
  History, 
  Menu, 
  X,
  RotateCcw,
  Layers,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { Avatar } from '../common/Avatar';
import { QuickAddModal } from '../expenses/QuickAddModal';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { 
    groups, 
    activeGroupId, 
    setActiveGroupId, 
    currentUser, 
    resetToSampleData 
  } = useExpenses();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('splitmate_theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('splitmate_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/add-expense', label: 'Split / Add', icon: PlusCircle },
    { to: '/settle', label: 'Balances & Settle', icon: Scale },
    { to: '/groups', label: 'Groups', icon: Users },
    { to: '/analytics', label: 'Analytics', icon: PieChart },
    { to: '/activity', label: 'Activity', icon: History }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.inner}>
            {/* Logo */}
            <Link to="/" className={styles.brand}>
              <div className={styles.brandLogo}>
                <Layers size={22} />
              </div>
              <span>
                Split<span style={{ color: '#818CF8' }}>Mate</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.navLinks}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => 
                      `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className={styles.actions}>
              {/* Quick Split CTA Button */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setQuickAddOpen(true)}
                title="1-Click Quick Split"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Zap size={14} />
                <span>Quick Split</span>
              </button>

              {/* Group Selector Dropdown */}
              <select
                value={activeGroupId}
                onChange={(e) => setActiveGroupId(e.target.value)}
                className={styles.groupSelector}
                title="Select Active Group"
              >
                <option value="all">🌐 All Groups</option>
                {groups.map(grp => (
                  <option key={grp.id} value={grp.id}>
                    {grp.name}
                  </option>
                ))}
              </select>

              {/* Theme Toggle (Dark / Light) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-outline btn-sm"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                style={{ padding: '0.4rem 0.6rem' }}
              >
                {theme === 'dark' ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#6366F1" />}
              </button>

              {/* Reset Data Button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all demo data back to default sample state?')) {
                    resetToSampleData();
                  }
                }}
                className="btn btn-outline btn-sm"
                title="Reset to default sample data"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <RotateCcw size={14} />
              </button>

              {/* Current User Pill */}
              <div className={styles.userBadge}>
                <Avatar 
                  name={currentUser?.name || 'Joy'} 
                  color={currentUser?.avatarColor || '#6366F1'} 
                  size={26} 
                />
                <span className={styles.userName}>{currentUser?.name?.split(' ')[0] || 'Joy'}</span>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ display: 'none' }}
                id="mobile-nav-toggle"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 15, 25, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 99,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
                style={{ padding: '0.85rem 1rem', fontSize: '1rem' }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

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
