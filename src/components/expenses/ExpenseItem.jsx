import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import {
  formatCurrency,
  formatShortDate,
  getCategoryMeta,
} from '../../utils/formatters';
import { roundCurrency } from '../../utils/expenseCalculations';
import styles from './ExpenseItem.module.css';

const SPLIT_LABELS = {
  equal: 'Equal Split',
  exact: 'Exact Amounts',
  percentage: 'Percentage %',
};

export default function ExpenseItem({
  expense,
  members,
  group,
  activeUserId,
  currency = 'INR',
  showGroupLink = true,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);

  const memberMap = new Map(members.map((m) => [m.id, m]));
  const payer = memberMap.get(expense.paidBy);
  const categoryMeta = getCategoryMeta(expense.category);

  // Compute personal financial impact for activeUserId
  const activeSplit = expense.splits.find((s) => s.memberId === activeUserId);
  const activeShare = activeSplit ? Number(activeSplit.amount) : 0;
  const activePaid = expense.paidBy === activeUserId ? Number(expense.amount) : 0;
  const personalDelta = roundCurrency(activePaid - activeShare);

  // Extract short month & day for calendar badge
  const parsedDate = new Date(`${expense.date}T00:00:00`);
  const monthLabel = Number.isNaN(parsedDate.getTime())
    ? 'EXP'
    : parsedDate.toLocaleDateString('en-US', { month: 'short' });
  const dayLabel = Number.isNaN(parsedDate.getTime())
    ? '--'
    : String(parsedDate.getDate()).padStart(2, '0');

  return (
    <article className={styles.wrapper}>
      <div
        className={styles.mainRow}
        onClick={() => setExpanded((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
      >
        <div className={styles.leftCluster}>
          <div className={styles.dateBadge} title={formatShortDate(expense.date)}>
            <span className={styles.dateMonth}>{monthLabel}</span>
            <span className={`${styles.dateDay} tabular-nums`}>{dayLabel}</span>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.titleLine}>
              <span className={styles.title}>{expense.title}</span>
              <Badge
                style={{
                  backgroundColor: categoryMeta.bg,
                  color: categoryMeta.color,
                  borderColor: `${categoryMeta.color}30`,
                }}
              >
                {categoryMeta.label}
              </Badge>
            </div>

            <div className={styles.metaLine}>
              <span>
                Paid by{' '}
                <strong>
                  {expense.paidBy === activeUserId
                    ? 'You'
                    : payer?.name || 'Member'}
                </strong>
              </span>
              <span className={styles.dot}>•</span>
              <span>{SPLIT_LABELS[expense.splitMode] || 'Equal Split'}</span>
              {showGroupLink && group ? (
                <>
                  <span className={styles.dot}>•</span>
                  <Link
                    to={`/groups/${group.id}`}
                    className={styles.groupLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {group.name}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.rightCluster}>
          <div className={styles.amountColumn}>
            <div className={`${styles.totalAmount} tabular-nums`}>
              {formatCurrency(expense.amount, currency)}
            </div>
            <div
              className={`${styles.personalImpact} tabular-nums ${
                personalDelta > 0.01
                  ? styles.lent
                  : personalDelta < -0.01
                  ? styles.borrowed
                  : styles.neutralImpact
              }`}
            >
              {personalDelta > 0.01
                ? `You lent ${formatCurrency(personalDelta, currency)}`
                : personalDelta < -0.01
                ? `You owe ${formatCurrency(Math.abs(personalDelta), currency)}`
                : activeShare > 0
                ? 'Settled on bill'
                : 'Not in split'}
            </div>
          </div>
          <span className={styles.chevronBox}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </div>

      {expanded ? (
        <div className={styles.expandedPanel}>
          {expense.notes ? (
            <div className={styles.notesRow}>
              <strong>Note:</strong> {expense.notes}
            </div>
          ) : null}

          <div className={styles.splitsGrid}>
            {expense.splits.map((split) => {
              const person = memberMap.get(split.memberId);
              const isPayer = split.memberId === expense.paidBy;
              return (
                <div key={split.memberId} className={styles.splitCard}>
                  <div className={styles.splitMember}>
                    <Avatar
                      name={person?.name || split.memberId}
                      color={person?.color || '#0f766e'}
                      size="xs"
                    />
                    <div style={{ minWidth: 0 }}>
                      <div className={styles.splitName}>
                        {person?.name || split.memberId}
                      </div>
                      {isPayer ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: 'var(--brand-primary)',
                          }}
                        >
                          Paid bill
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.splitRight}>
                    <div className={`${styles.splitShare} tabular-nums`}>
                      {formatCurrency(split.amount, currency)}
                    </div>
                    <div className={`${styles.splitPct} tabular-nums`}>
                      {Number(split.percentage || 0).toFixed(
                        Number(split.percentage) % 1 === 0 ? 0 : 1
                      )}
                      %
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.actionsBar}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Recorded for {formatShortDate(expense.date)} •{' '}
              {expense.splits.length} participants
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {onEdit ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Pencil}
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
