import React, { useState } from 'react';
import { Scale, CheckCircle2, Info, PlusCircle, ArrowRight } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { DebtCard } from '../components/settlements/DebtCard';
import { BalanceMatrix } from '../components/settlements/BalanceMatrix';
import { SettleModal } from '../components/settlements/SettleModal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettlementsPage = () => {
  const { simplifiedDebts, activeGroup, scopedMembers } = useExpenses();
  const [customSettleOpen, setCustomSettleOpen] = useState(false);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: '2rem' 
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>Balances & Settlements</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Scope: <strong style={{ color: '#ffffff' }}>{activeGroup ? activeGroup.name : 'All Groups Combined'}</strong>
            {' • '}{scopedMembers.length} members
          </p>
        </div>

        <Button 
          variant="success" 
          icon={PlusCircle}
          onClick={() => setCustomSettleOpen(true)}
        >
          Record Custom Payment
        </Button>
      </div>

      {/* Debt Simplification Explanation Box */}
      <div 
        style={{ 
          padding: '1rem 1.25rem', 
          background: 'rgba(99, 102, 241, 0.08)', 
          border: '1px solid rgba(99, 102, 241, 0.25)', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: '#cbd5e1'
        }}
      >
        <Info size={20} color="#818CF8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#ffffff' }}>Smart Debt Simplification:</strong> Antigravity's greedy settlement algorithm automatically reduces the total number of cross-payments between friends to the theoretical minimum, eliminating circular debts so you never have to pay back someone who owes another friend.
        </div>
      </div>

      {/* Grid: Left Column Simplified Debts, Right Column Balances */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Simplified Debts */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Recommended Settlements ({simplifiedDebts.length})
            </h3>
          </div>

          {simplifiedDebts.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <CheckCircle2 size={42} color="#10B981" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>All balances are square!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Everyone in this group is fully settled up. No payments are currently owed.
              </p>
            </Card>
          ) : (
            <div>
              {simplifiedDebts.map(tx => (
                <DebtCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </div>

        {/* Detailed Balance Matrix */}
        <div>
          <BalanceMatrix />
        </div>

      </div>

      {/* Custom Settlement Modal */}
      {customSettleOpen && (
        <SettleModal
          isOpen={customSettleOpen}
          onClose={() => setCustomSettleOpen(false)}
        />
      )}
    </div>
  );
};
