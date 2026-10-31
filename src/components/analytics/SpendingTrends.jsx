import React from 'react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

export const SpendingTrends = () => {
  const { scopedMembers, scopedExpenses } = useExpenses();

  // Calculate spend per member using map and reduce
  const memberSpendData = scopedMembers.map(member => {
    const paidAmount = scopedExpenses.reduce((acc, exp) => {
      return exp.paidBy === member.id ? acc + Number(exp.amount || 0) : acc;
    }, 0);
    return {
      member,
      amount: Math.round(paidAmount * 100) / 100
    };
  });

  const maxAmount = Math.max(...memberSpendData.map(d => d.amount), 1);

  return (
    <Card 
      title="Member Out-of-Pocket Contribution" 
      subtitle="Total money paid upfront by each member"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        {memberSpendData.map(({ member, amount }) => {
          const barHeightPercent = Math.round((amount / maxAmount) * 100);

          return (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <Avatar name={member.name} color={member.avatarColor} size={24} />
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.name.split(' ')[0]}
                </span>
              </div>

              {/* Dynamic Bar */}
              <div style={{ flex: 1, height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.max(4, barHeightPercent)}%`, 
                    background: `linear-gradient(90deg, ${member.avatarColor || '#6366F1'}, #818CF8)`,
                    borderRadius: '6px',
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '80px', textAlign: 'right', color: '#f8fafc' }}>
                {formatCurrency(amount)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
