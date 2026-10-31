import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Receipt, 
  PieChart, 
  Check, 
  AlertCircle, 
  Layers, 
  FileText, 
  ArrowLeft 
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';
import { getCategoryIcon } from '../utils/categoryIcons';
import { validateSplitAllocations } from '../utils/arrayHelpers';

export const AddExpensePage = () => {
  const navigate = useNavigate();
  const { 
    groups, 
    activeGroupId, 
    members, 
    categories, 
    currentUserId, 
    addExpense 
  } = useExpenses();

  // Primary form state
  const [groupId, setGroupId] = useState(
    activeGroupId !== 'all' ? activeGroupId : (groups[0]?.id || '')
  );
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [splitType, setSplitType] = useState('EQUAL'); // 'EQUAL', 'EXACT', 'PERCENTAGE', 'SHARES'

  // Get members belonging to selected group
  const activeGroup = groups.find(g => g.id === groupId);
  const groupMembers = useMemo(() => {
    if (!activeGroup) return members;
    return members.filter(m => activeGroup.members.includes(m.id));
  }, [members, activeGroup]);

  // Per-member split config state: { [memberId]: { included: true, exact: 0, percentage: 0, shares: 1 } }
  const [memberSplits, setMemberSplits] = useState({});

  // Initialize/reset member splits whenever group members change
  useEffect(() => {
    const initial = {};
    const count = groupMembers.length || 1;
    const defaultPercentage = Math.round((100 / count) * 10) / 10;

    groupMembers.forEach(m => {
      initial[m.id] = {
        included: true,
        exact: '',
        percentage: defaultPercentage,
        shares: 1
      };
    });
    setMemberSplits(initial);
  }, [groupMembers]);

  // Total numeric amount
  const numericAmount = parseFloat(amount) || 0;

  // Compute calculated splits dynamically using JavaScript Array operations
  const calculatedSplits = useMemo(() => {
    if (numericAmount <= 0) return [];

    if (splitType === 'EQUAL') {
      // Filter included members using .filter()
      const included = groupMembers.filter(m => memberSplits[m.id]?.included);
      const count = included.length || 1;
      const share = Math.round((numericAmount / count) * 100) / 100;
      
      // Handle remaining cents precision
      let remainder = Math.round((numericAmount - (share * count)) * 100) / 100;

      return groupMembers.map(m => {
        const isInc = memberSplits[m.id]?.included;
        let finalShare = 0;
        if (isInc) {
          finalShare = share;
          if (remainder > 0) {
            finalShare += 0.01;
            remainder -= 0.01;
          }
        }
        return {
          memberId: m.id,
          amount: Math.round(finalShare * 100) / 100,
          percentage: numericAmount > 0 ? Math.round((finalShare / numericAmount) * 100) : 0
        };
      });
    }

    if (splitType === 'EXACT') {
      return groupMembers.map(m => {
        const val = parseFloat(memberSplits[m.id]?.exact) || 0;
        return {
          memberId: m.id,
          amount: Math.round(val * 100) / 100,
          percentage: numericAmount > 0 ? Math.round((val / numericAmount) * 100) : 0
        };
      });
    }

    if (splitType === 'PERCENTAGE') {
      return groupMembers.map(m => {
        const pct = parseFloat(memberSplits[m.id]?.percentage) || 0;
        const val = (pct / 100) * numericAmount;
        return {
          memberId: m.id,
          amount: Math.round(val * 100) / 100,
          percentage: pct
        };
      });
    }

    if (splitType === 'SHARES') {
      const totalShares = groupMembers.reduce((sum, m) => {
        return sum + (Number(memberSplits[m.id]?.shares) || 0);
      }, 0) || 1;

      return groupMembers.map(m => {
        const shares = Number(memberSplits[m.id]?.shares) || 0;
        const val = (shares / totalShares) * numericAmount;
        return {
          memberId: m.id,
          shares,
          amount: Math.round(val * 100) / 100,
          percentage: numericAmount > 0 ? Math.round((val / numericAmount) * 100) : 0
        };
      });
    }

    return [];
  }, [groupMembers, memberSplits, splitType, numericAmount]);

  // Validation
  const validation = useMemo(() => {
    if (!title.trim()) return { isValid: false, message: 'Expense title is required.' };
    if (numericAmount <= 0) return { isValid: false, message: 'Please enter a valid expense amount.' };
    return validateSplitAllocations(calculatedSplits, numericAmount, splitType);
  }, [title, numericAmount, calculatedSplits, splitType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation.isValid) return;

    addExpense({
      title: title.trim(),
      amount: numericAmount,
      groupId,
      paidBy,
      category,
      date,
      notes: notes.trim(),
      splitType,
      splits: calculatedSplits
    });

    navigate('/expenses');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ width: '36px', height: '36px', padding: 0 }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>Split an Expense</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Choose group, split method, and allocate shares in real time
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Primary Details */}
          <Card title="1. Expense Details">
            {/* Group Selection */}
            <div className="form-group">
              <label className="form-label">Group / Trip</label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="form-select"
                required
              >
                {groups.map(grp => (
                  <option key={grp.id} value={grp.id}>{grp.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Expense Description / Title</label>
              <input
                type="text"
                placeholder="e.g. Seafood Dinner at Fisherman's Wharf"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Total Amount & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Amount ($)</label>
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

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Paid By & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
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

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes (Optional)</label>
              <textarea
                placeholder="Add receipt breakdown, tax notes, or payment links..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                rows={2}
              />
            </div>
          </Card>

          {/* Right Column: Split Calculator Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card title="2. Split Calculator">
              {/* Split Mode Selector Tabs */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '0.4rem', 
                  background: 'rgba(255, 255, 255, 0.04)', 
                  padding: '0.35rem', 
                  borderRadius: '12px',
                  marginBottom: '1.25rem'
                }}
              >
                {[
                  { id: 'EQUAL', label: 'Equally' },
                  { id: 'EXACT', label: 'Exact $' },
                  { id: 'PERCENTAGE', label: 'By %' },
                  { id: 'SHARES', label: 'By Shares' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSplitType(tab.id)}
                    className="btn btn-sm"
                    style={{
                      padding: '0.5rem 0.25rem',
                      fontSize: '0.75rem',
                      background: splitType === tab.id ? 'var(--primary)' : 'transparent',
                      color: splitType === tab.id ? '#ffffff' : 'var(--text-secondary)',
                      borderRadius: '8px'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Members Dynamic Allocation Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {groupMembers.map(member => {
                  const currentSplit = memberSplits[member.id] || {};
                  const computed = calculatedSplits.find(s => s.memberId === member.id) || { amount: 0, percentage: 0 };

                  return (
                    <div 
                      key={member.id} 
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {splitType === 'EQUAL' && (
                          <input
                            type="checkbox"
                            checked={currentSplit.included ?? true}
                            onChange={(e) => {
                              setMemberSplits(prev => ({
                                ...prev,
                                [member.id]: { ...prev[member.id], included: e.target.checked }
                              }));
                            }}
                            style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                          />
                        )}
                        <Avatar name={member.name} color={member.avatarColor} size={28} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {member.name}
                        </span>
                      </div>

                      {/* Inputs depending on split method */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {splitType === 'EXACT' && (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={currentSplit.exact ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMemberSplits(prev => ({
                                ...prev,
                                [member.id]: { ...prev[member.id], exact: val }
                              }));
                            }}
                            className="form-input"
                            style={{ width: '90px', padding: '0.35rem 0.65rem', height: '34px', fontSize: '0.85rem' }}
                          />
                        )}

                        {splitType === 'PERCENTAGE' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={currentSplit.percentage ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMemberSplits(prev => ({
                                  ...prev,
                                  [member.id]: { ...prev[member.id], percentage: val }
                                }));
                              }}
                              className="form-input"
                              style={{ width: '70px', padding: '0.35rem 0.5rem', height: '34px', fontSize: '0.85rem' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>%</span>
                          </div>
                        )}

                        {splitType === 'SHARES' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={currentSplit.shares ?? 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setMemberSplits(prev => ({
                                  ...prev,
                                  [member.id]: { ...prev[member.id], shares: val }
                                }));
                              }}
                              className="form-input"
                              style={{ width: '60px', padding: '0.35rem 0.5rem', height: '34px', fontSize: '0.85rem' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>share(s)</span>
                          </div>
                        )}

                        {/* Calculated Final Share */}
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '70px', textAlign: 'right', color: '#f8fafc' }}>
                          {formatCurrency(computed.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Visual Share Distribution Bar (Dynamic Inline Styles) */}
              {numericAmount > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Allocation Meter</span>
                    <span>{splitType} Split</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                    {calculatedSplits.map((split) => {
                      const m = members.find(mem => mem.id === split.memberId);
                      return (
                        <div
                          key={split.memberId}
                          title={`${m?.name}: ${split.percentage}% (${formatCurrency(split.amount)})`}
                          style={{
                            height: '100%',
                            width: `${split.percentage}%`,
                            background: m?.avatarColor || '#6366F1',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Validation Alert */}
              {!validation.isValid && numericAmount > 0 && (
                <div 
                  style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem 1rem', 
                    background: 'rgba(244, 63, 94, 0.1)', 
                    border: '1px solid rgba(244, 63, 94, 0.3)', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.825rem',
                    color: '#fb7185'
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{validation.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!validation.isValid}
                  style={{ width: '100%' }}
                >
                  Save & Split Expense
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </form>
    </div>
  );
};
