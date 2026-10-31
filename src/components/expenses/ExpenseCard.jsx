import React, { useState } from 'react';
import { Trash2, Calendar, Users, Eye } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { ExpenseDetailsModal } from './ExpenseDetailsModal';
import styles from './ExpenseCard.module.css';

export const ExpenseCard = ({ expense }) => {
  const { membersMap, currentUserId, groups, deleteExpense, categories } = useExpenses();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const payer = membersMap[expense.paidBy] || { name: 'Unknown' };
  const group = groups.find(g => g.id === expense.groupId);
  const categoryObj = categories.find(c => c.id === expense.category) || {
    label: 'Other',
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.15)'
  };

  // Find user's split share using array .find()
  const userSplit = Array.isArray(expense.splits) 
    ? expense.splits.find(s => s.memberId === currentUserId) 
    : null;
  
  const isPayer = expense.paidBy === currentUserId;
  const userOwesAmount = userSplit ? Number(userSplit.amount) : 0;

  // Determine user's net relationship to this bill
  let userShareText = 'not involved';
  let shareClass = styles.userShareNone;

  if (isPayer) {
    const lentAmount = Number(expense.amount) - userOwesAmount;
    if (lentAmount > 0) {
      userShareText = `you get back ${formatCurrency(lentAmount)}`;
      shareClass = styles.userShareLent;
    } else {
      userShareText = `you paid for yourself`;
      shareClass = styles.userShareNone;
    }
  } else if (userOwesAmount > 0) {
    userShareText = `you owe ${formatCurrency(userOwesAmount)}`;
    shareClass = styles.userShareBorrowed;
  }

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete expense "${expense.title}"?`)) {
      deleteExpense(expense.id);
    }
  };

  return (
    <>
      <div 
        className={styles.card} 
        onClick={() => setDetailsOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.leftSection}>
          {/* Category Icon with Dynamic Inline Styling */}
          <div 
            className={styles.categoryIcon}
            style={{
              backgroundColor: categoryObj.bg,
              color: categoryObj.color,
              border: `1px solid ${categoryObj.color}35`
            }}
          >
            {getCategoryIcon(expense.category, 20)}
          </div>

          <div className={styles.details}>
            <h4 className={styles.title}>{expense.title}</h4>
            
            <div className={styles.metadata}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Avatar name={payer.name} color={payer.avatarColor} size={18} />
                <span style={{ color: isPayer ? '#818CF8' : 'var(--text-secondary)' }}>
                  {isPayer ? 'You paid' : `${payer.name} paid`}
                </span>
              </span>

              <span>•</span>
              
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={13} />
                {formatDate(expense.date)}
              </span>

              {group && (
                <>
                  <span>•</span>
                  <Badge variant="neutral" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                    {group.name}
                  </Badge>
                </>
              )}

              <Badge 
                variant="neutral" 
                style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', opacity: 0.85 }}
              >
                {expense.splitType === 'EQUAL' ? 'Split equally' :
                 expense.splitType === 'EXACT' ? 'Exact split' :
                 expense.splitType === 'PERCENTAGE' ? '% split' :
                 expense.splitType === 'SHARES' ? 'By shares' : 'Split equally'}
              </Badge>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.amounts}>
            <span className={styles.totalAmount}>
              {formatCurrency(expense.amount)}
            </span>
            <span className={`${styles.userShare} ${shareClass}`}>
              {userShareText}
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
              title="Delete expense"
              aria-label="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {detailsOpen && (
        <ExpenseDetailsModal 
          expense={expense} 
          isOpen={detailsOpen} 
          onClose={() => setDetailsOpen(false)} 
        />
      )}
    </>
  );
};
