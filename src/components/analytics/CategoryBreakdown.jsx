import React from 'react';
import { Card } from '../common/Card';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

export const CategoryBreakdown = () => {
  const { categoryBreakdown, totalSpend } = useExpenses();

  return (
    <Card 
      title="Category Spending" 
      subtitle={`Total Scope Spend: ${formatCurrency(totalSpend)}`}
    >
      {categoryBreakdown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          No categorized expenses in this scope yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {categoryBreakdown.map((cat) => (
            <div key={cat.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '8px', 
                      background: cat.bg, 
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getCategoryIcon(cat.id, 15)}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cat.percentage}%</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{formatCurrency(cat.amount)}</span>
                </div>
              </div>

              {/* Dynamic Inline Width for Progress Bar */}
              <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${cat.percentage}%`, 
                    background: cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
