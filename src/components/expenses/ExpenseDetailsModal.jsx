import React from 'react';
import { Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

export const ExpenseDetailsModal = ({ expense, isOpen, onClose }) => {
  const { membersMap, groups, categories } = useExpenses();

  if (!expense) return null;

  const payer = membersMap[expense.paidBy] || { name: 'Unknown', avatarColor: '#6366F1' };
  const group = groups.find(g => g.id === expense.groupId);
  const category = categories.find(c => c.id === expense.category) || { label: 'General', color: '#6366F1' };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Expense Details"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Main Expense Banner */}
        <div 
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '14px', 
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: category.bg || 'rgba(99, 102, 241, 0.15)',
                color: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${category.color}40`
              }}
            >
              {getCategoryIcon(expense.category, 22)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{expense.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={13} />
                <span>{formatDate(expense.date)}</span>
                {group && (
                  <>
                    <span>•</span>
                    <span>{group.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {formatCurrency(expense.amount)}
            </span>
            <div style={{ marginTop: '0.2rem' }}>
              <Badge variant="neutral">
                {expense.splitType === 'EQUAL' ? 'Split equally' :
                 expense.splitType === 'EXACT' ? 'Exact split' :
                 expense.splitType === 'PERCENTAGE' ? '% split' :
                 expense.splitType === 'SHARES' ? 'By shares' : 'Split equally'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Paid By info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Avatar name={payer.name} color={payer.avatarColor} size={30} />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 600 }}>Paid In Full By</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{payer.name}</div>
            </div>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
            {formatCurrency(expense.amount)}
          </span>
        </div>

        {/* Notes if available */}
        {expense.notes && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
              <FileText size={13} />
              <span>Notes</span>
            </div>
            {expense.notes}
          </div>
        )}

        {/* Split Breakdown Table rendered dynamically using JS Array .map() */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Split Breakdown ({expense.splits?.length || 0} participants)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array.isArray(expense.splits) && expense.splits.map((split) => {
              const member = membersMap[split.memberId] || { name: 'Member', avatarColor: '#6366F1' };
              const percent = expense.amount > 0 
                ? Math.round((Number(split.amount) / Number(expense.amount)) * 100) 
                : 0;

              return (
                <div 
                  key={split.memberId}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Avatar name={member.name} color={member.avatarColor} size={26} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {member.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {percent}%
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                        {formatCurrency(split.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Inline Progress Bar */}
                  <div style={{ height: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${percent}%`, 
                        background: `linear-gradient(90deg, ${member.avatarColor || '#6366F1'}, #818CF8)`,
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
