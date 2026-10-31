import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { AvatarStack } from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import CreateGroupModal from '../components/expenses/CreateGroupModal';
import { GROUP_TYPES } from '../data/seedData';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import styles from './Groups.module.css';

export default function GroupsPage() {
  const navigate = useNavigate();
  const { groupSummaries, currency, openExpenseModal } = useExpenses();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const visibleGroups = useMemo(() => {
    if (typeFilter === 'ALL') return groupSummaries;
    return groupSummaries.filter((g) => g.type === typeFilter);
  }, [groupSummaries, typeFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Shared Groups & Trips</h1>
          <p className="page-subtitle">
            Manage dedicated ledgers for trips, flatmates, dinners, and group events
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Create New Group
        </Button>
      </div>

      {/* Dynamic Filter Pills using .map() */}
      <div className={styles.filterPills}>
        <button
          type="button"
          className={`${styles.filterPill} ${
            typeFilter === 'ALL' ? styles.filterPillActive : ''
          }`}
          onClick={() => setTypeFilter('ALL')}
        >
          All Groups ({groupSummaries.length})
        </button>
        {GROUP_TYPES.map((gt) => {
          const count = groupSummaries.filter((g) => g.type === gt.id).length;
          return (
            <button
              key={gt.id}
              type="button"
              className={`${styles.filterPill} ${
                typeFilter === gt.id ? styles.filterPillActive : ''
              }`}
              onClick={() => setTypeFilter(gt.id)}
            >
              {gt.label} ({count})
            </button>
          );
        })}
      </div>

      {visibleGroups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups match this filter"
          description="Create a new shared group or switch back to view all groups."
          action={
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Group
            </Button>
          }
        />
      ) : (
        <div className={styles.groupsGrid}>
          {visibleGroups.map((group) => (
            <div key={group.id} className={styles.groupCard}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <Badge tone="brand">{group.type}</Badge>
                  <Badge
                    tone={
                      group.activeUserNet > 0.01
                        ? 'positive'
                        : group.activeUserNet < -0.01
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {group.activeUserNet > 0.01
                      ? `Owed ${formatCurrency(group.activeUserNet, currency)}`
                      : group.activeUserNet < -0.01
                      ? `You owe ${formatCurrency(Math.abs(group.activeUserNet), currency)}`
                      : 'All settled'}
                  </Badge>
                </div>

                <Link to={`/groups/${group.id}`}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {group.name}
                  </h3>
                </Link>

                {group.description ? (
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      marginTop: '5px',
                    }}
                  >
                    {group.description}
                  </p>
                ) : null}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: '14px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      Total Spend
                    </div>
                    <div
                      className="tabular-nums"
                      style={{ fontSize: '0.96rem', fontWeight: 700 }}
                    >
                      {formatCurrency(group.totalSpend, currency)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      Activity
                    </div>
                    <div
                      className="tabular-nums"
                      style={{ fontSize: '0.96rem', fontWeight: 700 }}
                    >
                      {group.expenseCount} expenses
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AvatarStack members={group.members} size="xs" max={4} />
                  <span
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Since {formatShortDate(group.createdAt)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() =>
                      openExpenseModal({ defaultGroupId: group.id })
                    }
                  >
                    Bill
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    Open <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(created) => navigate(`/groups/${created.id}`)}
      />
    </div>
  );
}
