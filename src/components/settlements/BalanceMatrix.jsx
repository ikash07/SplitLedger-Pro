import React from 'react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

export const BalanceMatrix = () => {
  const { scopedMembers, scopedExpenses, netBalances } = useExpenses();

  // Compute total paid and total share per member using array reduce
  const memberStats = scopedMembers.map(member => {
    // Total amount this member paid out of pocket
    const totalPaid = scopedExpenses.reduce((acc, exp) => {
      return exp.paidBy === member.id ? acc + Number(exp.amount || 0) : acc;
    }, 0);

    // Total amount this member's share was across all expenses
    const totalShare = scopedExpenses.reduce((acc, exp) => {
      if (!Array.isArray(exp.splits)) return acc;
      const split = exp.splits.find(s => s.memberId === member.id);
      return split ? acc + Number(split.amount || 0) : acc;
    }, 0);

    const net = netBalances[member.id] || 0;

    return {
      member,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalShare: Math.round(totalShare * 100) / 100,
      net: Math.round(net * 100) / 100
    };
  });

  return (
    <Card 
      title="Member Balance Ledger" 
      subtitle="Detailed breakdown of total paid, consumed share, and final net balance"
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Member</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Total Paid</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Total Share</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Net Balance</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {memberStats.map(({ member, totalPaid, totalShare, net }) => {
              const isPositive = net > 0.01;
              const isNegative = net < -0.01;

              return (
                <tr 
                  key={member.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Avatar name={member.name} color={member.avatarColor} size={28} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {member.name} {member.isCurrentUser && '(You)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(totalPaid)}
                  </td>

                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(totalShare)}
                  </td>

                  <td 
                    style={{ 
                      padding: '0.85rem 0.5rem', 
                      textAlign: 'right', 
                      fontWeight: 700,
                      color: isPositive ? '#34d399' : isNegative ? '#fb7185' : 'var(--text-muted)'
                    }}
                  >
                    {isPositive ? `+${formatCurrency(net)}` : isNegative ? `-${formatCurrency(Math.abs(net))}` : '$0.00'}
                  </td>

                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                    {isPositive ? (
                      <Badge variant="success">Gets back {formatCurrency(net)}</Badge>
                    ) : isNegative ? (
                      <Badge variant="danger">Owes {formatCurrency(Math.abs(net))}</Badge>
                    ) : (
                      <Badge variant="neutral">Settled</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
