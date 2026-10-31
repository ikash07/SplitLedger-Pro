import React, { useState } from 'react';
import { ArrowRight, CheckCheck } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { SettleModal } from './SettleModal';

/**
 * DebtCard: shows "Person A → pays $XX → Person B" in plain English
 */
export const DebtCard = ({ transaction }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const fromName = transaction.fromMember.name;
  const toName = transaction.toMember.name;

  return (
    <>
      <div 
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '0.75rem'
        }}
      >
        {/* Left: who pays whom, in a readable sentence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 260px' }}>
          <Avatar 
            name={fromName} 
            color={transaction.fromMember.avatarColor || '#F43F5E'} 
            size={38} 
          />

          <span style={{ fontSize: '1.25rem' }}>➡️</span>

          <Avatar 
            name={toName} 
            color={transaction.toMember.avatarColor || '#10B981'} 
            size={38} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginLeft: '0.25rem' }}>
            {/* Plain-English sentence: "Rohan pays Priya" */}
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {fromName.split(' ')[0]} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>pays</span> {toName.split(' ')[0]}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
              To be all square 🤝
            </span>
          </div>
        </div>

        {/* Right: amount + action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span 
            style={{ 
              fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', 
              color: 'var(--text-primary)' 
            }}
          >
            {formatCurrency(transaction.amount)}
          </span>

          <Button
            variant="success"
            size="sm"
            icon={CheckCheck}
            onClick={() => setModalOpen(true)}
          >
            Mark Paid
          </Button>
        </div>
      </div>

      {modalOpen && (
        <SettleModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultDebtorId={transaction.fromMemberId}
          defaultCreditorId={transaction.toMemberId}
          defaultAmount={transaction.amount}
        />
      )}
    </>
  );
};
