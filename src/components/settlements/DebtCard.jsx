import React, { useState } from 'react';
import { ArrowRight, CheckCheck, Sparkles } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { SettleModal } from './SettleModal';

export const DebtCard = ({ transaction }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 280px' }}>
          {/* Debtor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar 
              name={transaction.fromMember.name} 
              color={transaction.fromMember.avatarColor || '#F43F5E'} 
              size={36} 
            />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                {transaction.fromMember.name}
              </div>
              <span style={{ fontSize: '0.725rem', color: '#fb7185', fontWeight: 500 }}>
                owes
              </span>
            </div>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <ArrowRight size={16} color="var(--primary)" />
          </div>

          {/* Creditor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar 
              name={transaction.toMember.name} 
              color={transaction.toMember.avatarColor || '#10B981'} 
              size={36} 
            />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                {transaction.toMember.name}
              </div>
              <span style={{ fontSize: '0.725rem', color: '#34d399', fontWeight: 500 }}>
                is owed
              </span>
            </div>
          </div>
        </div>

        {/* Amount & Settle Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          <Button
            variant="success"
            size="sm"
            icon={CheckCheck}
            onClick={() => setModalOpen(true)}
          >
            Settle Up
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
