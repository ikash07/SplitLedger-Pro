import React from 'react';
import { History, Receipt, CheckCircle2, Trash2, Clock } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatRelativeTime, formatDate } from '../utils/formatters';

export const ActivityPage = () => {
  const { activities, membersMap, groups } = useExpenses();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem' }}>Audit Trail & Activity</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Real-time timeline of expenses added, updated, and debt settlements
        </p>
      </div>

      <Card>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <History size={40} style={{ margin: '0 auto 0.75rem auto' }} />
            <p>No activity records available.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.map((act) => {
              const actor = membersMap[act.actorId || act.fromMemberId] || { name: 'Member', avatarColor: '#6366F1' };
              const recipient = act.toMemberId ? membersMap[act.toMemberId] : null;
              const group = groups.find(g => g.id === act.groupId);

              let icon = <Receipt size={18} color="#818CF8" />;
              let badgeText = 'Expense Added';
              let badgeVariant = 'primary';

              if (act.type === 'SETTLEMENT') {
                icon = <CheckCircle2 size={18} color="#34D399" />;
                badgeText = 'Settled';
                badgeVariant = 'success';
              } else if (act.type === 'EXPENSE_DELETED') {
                icon = <Trash2 size={18} color="#FB7185" />;
                badgeText = 'Deleted';
                badgeVariant = 'danger';
              }

              return (
                <div 
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                          {act.title}
                        </span>
                        <Badge variant={badgeVariant} style={{ fontSize: '0.65rem' }}>{badgeText}</Badge>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        <Avatar name={actor.name} color={actor.avatarColor} size={18} />
                        <span>{actor.name}</span>
                        {recipient && <span>paid {recipient.name}</span>}
                        {group && (
                          <>
                            <span>•</span>
                            <span>{group.name}</span>
                          </>
                        )}
                        <span>•</span>
                        <Clock size={12} />
                        <span>{formatRelativeTime(act.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(act.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
