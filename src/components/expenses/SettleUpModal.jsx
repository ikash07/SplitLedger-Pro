import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

const PAYMENT_METHODS = ['UPI', 'Bank Transfer', 'Cash', 'Card'];

export default function SettleUpModal({
  isOpen,
  onClose,
  presetTransfer = null,
  defaultGroupId = '',
}) {
  const { members, groups, currency, recordSettlement } = useExpenses();

  const [groupId, setGroupId] = useState('');
  const [fromMemberId, setFromMemberId] = useState('');
  const [toMemberId, setToMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setGroupId(presetTransfer?.groupId || defaultGroupId || groups[0]?.id || '');
    setFromMemberId(presetTransfer?.fromId || members[1]?.id || members[0]?.id || '');
    setToMemberId(presetTransfer?.toId || members[0]?.id || '');
    setAmount(presetTransfer?.amount ? String(presetTransfer.amount) : '');
    setMethod('UPI');
    setNote(
      presetTransfer
        ? 'Settled simplified balance'
        : ''
    );
  }, [isOpen, presetTransfer, defaultGroupId, groups, members]);

  const fromPerson = members.find((m) => m.id === fromMemberId);
  const toPerson = members.find((m) => m.id === toMemberId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const num = Number(amount);
    if (!fromMemberId || !toMemberId || fromMemberId === toMemberId) {
      setError('Payer and recipient must be two different members.');
      return;
    }
    if (!Number.isFinite(num) || num <= 0) {
      setError('Enter a valid settlement amount greater than zero.');
      return;
    }

    recordSettlement({
      groupId,
      fromMemberId,
      toMemberId,
      amount: num,
      method,
      note,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Record Settlement Payment"
      subtitle="Mark a repayment between members to update net balances"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Confirm Settlement
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        {error ? (
          <div
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--negative-bg)',
              border: '1px solid var(--negative-border)',
              color: 'var(--negative-ink)',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : null}

        {/* Visual Transfer Preview */}
        {fromPerson && toPerson ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f0fdfa',
              border: '1px solid var(--brand-soft-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar name={fromPerson.name} color={fromPerson.color} size="sm" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {fromPerson.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Pays
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'var(--brand-primary)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
              className="tabular-nums"
            >
              <span>{formatCurrency(Number(amount) || 0, currency)}</span>
              <ArrowRight size={16} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {toPerson.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Receives
                </div>
              </div>
              <Avatar name={toPerson.name} color={toPerson.color} size="sm" />
            </div>
          </div>
        ) : null}

        <div className="grid-2" style={{ gap: '10px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="stl-from">
              Who Paid
            </label>
            <select
              id="stl-from"
              className="form-select"
              value={fromMemberId}
              onChange={(e) => setFromMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="stl-to">
              Paid To
            </label>
            <select
              id="stl-to"
              className="form-select"
              value={toMemberId}
              onChange={(e) => setToMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '10px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="stl-amount">
              Amount ({currency})
            </label>
            <input
              id="stl-amount"
              type="number"
              min="0"
              step="0.01"
              className="form-input tabular-nums"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="stl-method">
              Method
            </label>
            <select
              id="stl-method"
              className="form-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="stl-group">
            Associated Group
          </label>
          <select
            id="stl-group"
            className="form-select"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="stl-note">
            Reference Note (Optional)
          </label>
          <input
            id="stl-note"
            type="text"
            className="form-input"
            placeholder="e.g., UPI Ref #402918"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
