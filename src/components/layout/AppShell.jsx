import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  ArrowLeftRight,
  PieChart,
  Plus,
  RotateCcw,
  Split,
  CheckCircle2,
} from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import AddExpenseModal from '../expenses/AddExpenseModal';
import { ToastFloatingBanner } from '../styled/FinanceWidgets';
import { CURRENCIES } from '../../data/seedData';
import { useExpenses } from '../../context/ExpenseContext';
import styles from './AppShell.module.css';

export default function AppShell({ children }) {
  const {
    members,
    activeUser,
    activeUserId,
    setActiveUserId,
    currency,
    setCurrency,
    groupSummaries,
    expenses,
    overallTransfers,
    openExpenseModal,
    resetDemoData,
    toast,
  } = useExpenses();

  const navRoutes = [
    {
      to: '/',
      label: 'Overview',
      shortLabel: 'Home',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/groups',
      label: 'Shared Groups',
      shortLabel: 'Groups',
      icon: Users,
      badge: groupSummaries.length,
    },
    {
      to: '/expenses',
      label: 'Expenses Ledger',
      shortLabel: 'Ledger',
      icon: Receipt,
      badge: expenses.length,
    },
    {
      to: '/settlements',
      label: 'Settle Up',
      shortLabel: 'Settle',
      icon: ArrowLeftRight,
      badge: overallTransfers.length || '0',
    },
    {
      to: '/analytics',
      label: 'Insights',
      shortLabel: 'Insights',
      icon: PieChart,
    },
  ];

  return (
    <div className={styles.shell}>
      {/* Permanently Docked Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <Link to="/" className={styles.brandLink}>
            <span className={styles.logoMark}>
              <Split size={19} strokeWidth={2.4} />
            </span>
            <div>
              <span className={styles.brandTitle}>SplitLedger</span>
              <span className={styles.brandTag}>Shared Expense Tracker</span>
            </div>
          </Link>
        </div>

        <div className={styles.navScroll}>
          <div>
            <div className={styles.navSectionLabel}>Workspace</div>
            <nav className={styles.navList} aria-label="Main navigation">
              {navRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <NavLink
                    key={route.to}
                    to={route.to}
                    end={route.end}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.navItemActive : ''
                      }`
                    }
                  >
                    <span className={styles.navItemLeft}>
                      <Icon size={18} strokeWidth={2} />
                      <span>{route.label}</span>
                    </span>
                    {route.badge !== undefined ? (
                      <span className={`${styles.navBadge} tabular-nums`}>
                        {route.badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className={styles.navSectionLabel}>Quick Groups</div>
            <div className={styles.navList}>
              {groupSummaries.map((grp) => {
                const dotColor =
                  grp.activeUserNet > 0.01
                    ? 'var(--positive-ink)'
                    : grp.activeUserNet < -0.01
                      ? 'var(--negative-ink)'
                      : '#94a3b8';

                return (
                  <NavLink
                    key={grp.id}
                    to={`/groups/${grp.id}`}
                    className={({ isActive }) =>
                      `${styles.groupShortcut} ${isActive ? styles.navItemActive : ''
                      }`
                    }
                  >
                    <span className={styles.groupShortcutName}>{grp.name}</span>
                    <span
                      className={styles.statusDot}
                      style={{ backgroundColor: dotColor }}
                      title={
                        grp.activeUserNet > 0.01
                          ? 'Owed to you'
                          : grp.activeUserNet < -0.01
                            ? 'You owe'
                            : 'Settled'
                      }
                    />
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            fullWidth
            onClick={resetDemoData}
          >
            Reset Demo Dataset
          </Button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.perspectiveBox} title="Switch active member view">
              <Avatar
                name={activeUser?.name}
                color={activeUser?.color}
                size="xs"
              />
              <span className={styles.perspectiveLabel}>Viewing as:</span>
              <select
                aria-label="Viewing as member"
                className={styles.perspectiveSelect}
                value={activeUserId}
                onChange={(e) => setActiveUserId(e.target.value)}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <select
              aria-label="Select currency"
              className={styles.currencySelect}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.label}
                </option>
              ))}
            </select>

            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => openExpenseModal()}
            >
              <span className={styles.addBtnText}>Add Expense</span>
            </Button>
          </div>
        </header>

        <main className={styles.contentContainer}>{children}</main>
      </div>

      {/* Global Add/Edit Expense Modal */}
      <AddExpenseModal />

      {/* Global Toast Notification */}
      {toast ? (
        <ToastFloatingBanner $tone={toast.tone} role="status">
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </ToastFloatingBanner>
      ) : null}
    </div>
  );
}
