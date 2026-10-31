import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, DollarSign, Wallet } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

export const SettleModal = ({
  isOpen,
  onClose,
  defaultDebtorId,
  defaultCreditorId,
  defaultAmount
}) => {
  const { membersMap, scopedMembers, settleDebt } = useExpenses();

  const [debtorId, setDebtorId] = useState(defaultDebtorId || scopedMembers[0]?.id);
  const [creditorId, setCreditorId] = useState(defaultCreditorId || scopedMembers[1]?.id);
  const [amount, setAmount] = useState(defaultAmount || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Bank Transfer');
  const [note, setNote] = useState('Paid share');
  const [settledSuccess, setSettledSuccess] = useState(false);

  const debtor = membersMap[debtorId] || { name: 'Payer' };
  const creditor = membersMap[creditorId] || { name: 'Receiver' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (debtorId === creditorId) {
      alert('Payer and receiver cannot be the same member.');
      return;
    }

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    settleDebt(debtorId, creditorId, Number(amount), `${paymentMethod} - ${note}`);
    setSettledSuccess(true);

    setTimeout(() => {
      setSettledSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record a Payment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={settledSuccess}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            icon={CheckCircle2} 
            onClick={handleSubmit} 
            disabled={settledSuccess || !amount || Number(amount) <= 0}
          >
            {settledSuccess ? 'Payment Recorded! 🎉' : 'Record Payment'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Visual Settlement Flow */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
            <Avatar name={debtor.name} color={debtor.avatarColor || '#F43F5E'} size={42} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{debtor.name}</span>
            <span style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 500 }}>PAYS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowRight size={22} color="var(--primary)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
              {amount ? formatCurrency(amount) : '$0.00'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
            <Avatar name={creditor.name} color={creditor.avatarColor || '#10B981'} size={42} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{creditor.name}</span>
            <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 500 }}>RECEIVES</span>
          </div>
        </div>

        {/* Member Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Who gave money?</label>
            <select 
              value={debtorId} 
              onChange={(e) => setDebtorId(e.target.value)}
              className="form-select"
            >
              {scopedMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Who got money?</label>
            <select 
              value={creditorId} 
              onChange={(e) => setCreditorId(e.target.value)}
              className="form-select"
            >
              {scopedMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Amount Paid ($)</label>
          <div className="input-icon-wrapper">
            <span className="input-icon-left">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input input-with-icon"
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Payment Mode</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-select"
          >
            <option value="UPI / Bank Transfer">UPI / Bank Transfer</option>
            <option value="Cash Payment">Cash Payment</option>
            <option value="PayPal / Venmo">PayPal / Venmo</option>
            <option value="Credit / Debit Card">Credit / Debit Card</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Note */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Notes (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Settle up for beach dinner"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-input"
          />
        </div>
      </form>
    </Modal>
  );
};
