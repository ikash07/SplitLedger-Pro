import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PlusCircle, Zap, DollarSign, Check, Users } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

export const QuickAddModal = ({ isOpen, onClose }) => {
  const { 
    groups, 
    activeGroupId, 
    members, 
    scopedMembers, 
    currentUserId, 
    addExpense 
  } = useExpenses();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [category, setCategory] = useState('food');
  const [groupId, setGroupId] = useState(activeGroupId !== 'all' ? activeGroupId : groups[0]?.id || '');

  const activeGroup = groups.find(g => g.id === groupId) || groups[0];
  const groupMembers = members.filter(m => activeGroup?.members.includes(m.id)) || scopedMembers;

  const numAmount = parseFloat(amount) || 0;
  const count = groupMembers.length || 1;
  const splitShare = numAmount > 0 ? Math.round((numAmount / count) * 100) / 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || numAmount <= 0) return;

    // Build equal splits
    const splits = groupMembers.map(m => ({
      memberId: m.id,
      amount: splitShare,
      percentage: Math.round((100 / count) * 10) / 10
    }));

    addExpense({
      title: title.trim(),
      amount: numAmount,
      groupId: activeGroup.id,
      paidBy,
      category,
      date: new Date().toISOString().split('T')[0],
      splitType: 'EQUAL',
      splits
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }

    setTitle('');
    setAmount('');
    onClose();
  };

  const quickCategories = [
    { id: 'food', label: 'Food', emoji: '🍔' },
    { id: 'travel', label: 'Travel', emoji: '🚕' },
    { id: 'groceries', label: 'Groceries', emoji: '🛒' },
    { id: 'entertainment', label: 'Fun', emoji: '🎉' },
    { id: 'utilities', label: 'Bills', emoji: '⚡' },
    { id: 'other', label: 'Other', emoji: '✨' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ 1-Click Quick Split"
      maxWidth={500}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            icon={Zap} 
            onClick={handleSubmit}
            disabled={!title.trim() || numAmount <= 0}
          >
            Split Evenly Now
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Group Selector */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Group / Trip</label>
          <select 
            value={groupId} 
            onChange={(e) => setGroupId(e.target.value)}
            className="form-select"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Big Amount & Title Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">What was this for?</label>
            <input
              type="text"
              placeholder="e.g. Uber Ride, Pizza Night, Coffee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              autoFocus
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Total Amount</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left" style={{ fontSize: '1.2rem', fontWeight: 700 }}>$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input input-with-icon"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
                required
              />
            </div>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.4rem' }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {quickCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '20px',
                  border: category === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: category === cat.id ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                  color: category === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paid By */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Paid Upfront By</label>
          <select 
            value={paidBy} 
            onChange={(e) => setPaidBy(e.target.value)}
            className="form-select"
          >
            {groupMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} {m.id === currentUserId && '(You)'}
              </option>
            ))}
          </select>
        </div>

        {/* Split Calculation Summary Box */}
        {numAmount > 0 && (
          <div 
            style={{ 
              padding: '0.85rem 1rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.25)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} color="#34d399" />
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                Split equally among <strong>{count} members</strong>
              </span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
              {formatCurrency(splitShare)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ person</span>
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
};
