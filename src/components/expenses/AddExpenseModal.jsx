import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import {
  SplitModeTabs,
  SplitModeTab,
  ParticipantPill,
  MeterTrack,
  MeterFill,
} from '../styled/FinanceWidgets';
import { useExpenses } from '../../context/ExpenseContext';
import { EXPENSE_CATEGORIES } from '../../data/seedData';
import {
  calculateEqualSplits,
  calculatePercentageSplits,
  roundCurrency,
} from '../../utils/expenseCalculations';
import { formatCurrency } from '../../utils/formatters';

export default function AddExpenseModal() {
  const {
    groups,
    members,
    activeUserId,
    currency,
    expenseModalState,
    closeExpenseModal,
    addExpense,
    updateExpense,
  } = useExpenses();

  const { isOpen, defaultGroupId, editingExpense } = expenseModalState;
  const titleInputRef = useRef(null);

  const [groupId, setGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState('2026-10-31');
  const [paidBy, setPaidBy] = useState('');
  const [notes, setNotes] = useState('');
  const [splitMode, setSplitMode] = useState('equal');
  const [selectedIds, setSelectedIds] = useState([]);
  const [exactMap, setExactMap] = useState({});
  const [pctMap, setPctMap] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === groupId) || groups[0],
    [groups, groupId]
  );

  const groupMembers = useMemo(() => {
    if (!selectedGroup) return [];
    return members.filter((m) => selectedGroup.memberIds.includes(m.id));
  }, [members, selectedGroup]);

  // Initialize form whenever modal opens or switches target expense
  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');

    if (editingExpense) {
      setGroupId(editingExpense.groupId);
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category || 'Food & Dining');
      setDate(editingExpense.date || '2026-10-31');
      setPaidBy(editingExpense.paidBy);
      setNotes(editingExpense.notes || '');
      setSplitMode(editingExpense.splitMode || 'equal');

      const splitMemberIds = editingExpense.splits.map((s) => s.memberId);
      setSelectedIds(splitMemberIds);

      const initialExact = {};
      const initialPct = {};
      editingExpense.splits.forEach((s) => {
        initialExact[s.memberId] = String(s.amount);
        initialPct[s.memberId] = String(s.percentage ?? 0);
      });
      setExactMap(initialExact);
      setPctMap(initialPct);
    } else {
      const targetGroup =
        groups.find((g) => g.id === defaultGroupId) || groups[0];
      const gId = targetGroup?.id || '';
      const gMemberIds = targetGroup?.memberIds || [];
      setGroupId(gId);
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().slice(0, 10));
      setPaidBy(
        gMemberIds.includes(activeUserId) ? activeUserId : gMemberIds[0] || ''
      );
      setNotes('');
      setSplitMode('equal');
      setSelectedIds(gMemberIds);

      const evenPct =
        gMemberIds.length > 0 ? roundCurrency(100 / gMemberIds.length) : 0;
      const nextPct = {};
      const nextExact = {};
      gMemberIds.forEach((id, idx) => {
        nextExact[id] = '';
        nextPct[id] =
          idx === 0
            ? String(
                roundCurrency(100 - evenPct * Math.max(0, gMemberIds.length - 1))
              )
            : String(evenPct);
      });
      setExactMap(nextExact);
      setPctMap(nextPct);
    }

    const focusTimer = window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen, editingExpense, defaultGroupId, groups, activeUserId]);

  const handleGroupChange = (nextGroupId) => {
    setGroupId(nextGroupId);
    const nextGroup = groups.find((g) => g.id === nextGroupId);
    if (!nextGroup) return;
    const ids = nextGroup.memberIds;
    setSelectedIds(ids);
    setPaidBy(ids.includes(activeUserId) ? activeUserId : ids[0] || '');

    const evenPct = ids.length > 0 ? roundCurrency(100 / ids.length) : 0;
    const nextPct = {};
    const nextExact = {};
    ids.forEach((id, idx) => {
      nextExact[id] = '';
      nextPct[id] =
        idx === 0
          ? String(roundCurrency(100 - evenPct * Math.max(0, ids.length - 1)))
          : String(evenPct);
    });
    setExactMap(nextExact);
    setPctMap(nextPct);
  };

  const toggleParticipant = (memberId) => {
    setSelectedIds((prev) => {
      const next = prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId];

      // Auto-rebalance percentages when toggling participants in percentage mode
      if (next.length > 0) {
        const even = roundCurrency(100 / next.length);
        const rebalanced = {};
        next.forEach((id, idx) => {
          rebalanced[id] =
            idx === 0
              ? String(roundCurrency(100 - even * Math.max(0, next.length - 1)))
              : String(even);
        });
        setPctMap((old) => ({ ...old, ...rebalanced }));
      }
      return next;
    });
  };

  const numericAmount = Number(amount) > 0 ? roundCurrency(Number(amount)) : 0;

  // Live preview of calculated splits across all 3 split modes
  const computedSplits = useMemo(() => {
    if (selectedIds.length === 0) return [];

    if (splitMode === 'equal') {
      return calculateEqualSplits(numericAmount, selectedIds);
    }

    if (splitMode === 'percentage') {
      return calculatePercentageSplits(numericAmount, selectedIds, pctMap);
    }

    // Exact amounts mode
    return selectedIds.map((memberId) => {
      const val = roundCurrency(Number(exactMap[memberId] || 0));
      const pct =
        numericAmount > 0 ? roundCurrency((val / numericAmount) * 100) : 0;
      return { memberId, amount: val, percentage: pct };
    });
  }, [splitMode, numericAmount, selectedIds, pctMap, exactMap]);

  const allocatedAmount = useMemo(
    () =>
      roundCurrency(
        computedSplits.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      ),
    [computedSplits]
  );

  const allocatedPct = useMemo(
    () =>
      roundCurrency(
        selectedIds.reduce(
          (sum, memberId) => sum + Number(pctMap[memberId] || 0),
          0
        )
      ),
    [selectedIds, pctMap]
  );

  const fillEqualIntoExact = () => {
    const equal = calculateEqualSplits(numericAmount, selectedIds);
    const next = {};
    equal.forEach((item) => {
      next[item.memberId] = String(item.amount);
    });
    setExactMap((prev) => ({ ...prev, ...next }));
  };

  const fillEvenPercentages = () => {
    if (selectedIds.length === 0) return;
    const even = roundCurrency(100 / selectedIds.length);
    const next = {};
    selectedIds.forEach((id, idx) => {
      next[id] =
        idx === 0
          ? String(
              roundCurrency(100 - even * Math.max(0, selectedIds.length - 1))
            )
          : String(even);
    });
    setPctMap((prev) => ({ ...prev, ...next }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an expense description.');
      return;
    }
    if (numericAmount <= 0) {
      setErrorMsg('Please enter a valid total amount greater than zero.');
      return;
    }
    if (!groupId) {
      setErrorMsg('Please select a group.');
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMsg('Select at least one participant to split this expense.');
      return;
    }
    if (splitMode === 'exact' && Math.abs(allocatedAmount - numericAmount) > 0.02) {
      const diff = roundCurrency(numericAmount - allocatedAmount);
      setErrorMsg(
        diff > 0
          ? `Exact shares are short by ${formatCurrency(diff, currency)}.`
          : `Exact shares exceed the bill by ${formatCurrency(Math.abs(diff), currency)}.`
      );
      return;
    }
    if (splitMode === 'percentage' && Math.abs(allocatedPct - 100) > 0.05) {
      setErrorMsg(
        `Percentages currently add up to ${allocatedPct}%. They must equal 100%.`
      );
      return;
    }

    const payload = {
      groupId,
      title: title.trim(),
      amount: numericAmount,
      category,
      paidBy,
      date,
      splitMode,
      notes: notes.trim(),
      splits: computedSplits,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, payload);
    } else {
      addExpense(payload);
    }

    closeExpenseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeExpenseModal}
      size="lg"
      title={editingExpense ? 'Edit Shared Expense' : 'Add Shared Expense'}
      subtitle="Record a group payment and split shares equally, by exact amount, or by percentage"
      footer={
        <>
          <Button variant="secondary" onClick={closeExpenseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingExpense ? 'Save Changes' : 'Save Expense'}
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {errorMsg ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--negative-bg)',
              border: '1px solid var(--negative-border)',
              color: 'var(--negative-ink)',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <div className="grid-2" style={{ gap: '12px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="exp-group">
              Group / Trip
            </label>
            <select
              id="exp-group"
              className="form-select"
              value={groupId}
              onChange={(e) => handleGroupChange(e.target.value)}
            >
              {groups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="exp-category">
              Category
            </label>
            <select
              id="exp-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '12px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="exp-title">
              Description
            </label>
            <input
              ref={titleInputRef}
              id="exp-title"
              type="text"
              className="form-input"
              placeholder="e.g., Hotel booking, Cab to airport, Grocery run"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="exp-amount">
              Total Amount ({currency})
            </label>
            <input
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              className="form-input tabular-nums"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2" style={{ gap: '12px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="exp-payer">
              Paid By
            </label>
            <select
              id="exp-payer"
              className="form-select"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {groupMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.id === activeUserId ? ' (You)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="exp-date">
              Date
            </label>
            <input
              id="exp-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Participant Selector */}
        <div className="form-field">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="form-label">
              Split Between ({selectedIds.length} of {groupMembers.length} members)
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds(groupMembers.map((m) => m.id))}
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--brand-primary)',
                fontSize: '0.77rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Select all
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {groupMembers.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              return (
                <ParticipantPill
                  key={member.id}
                  type="button"
                  $selected={isSelected}
                  onClick={() => toggleParticipant(member.id)}
                >
                  <Avatar name={member.name} color={member.color} size="xs" />
                  <span>{member.name.split(' ')[0]}</span>
                  {isSelected ? <Check size={14} /> : null}
                </ParticipantPill>
              );
            })}
          </div>
        </div>

        {/* Split Mode Tabs (Styled Components) */}
        <div className="form-field">
          <span className="form-label">Split Method</span>
          <SplitModeTabs>
            <SplitModeTab
              type="button"
              $active={splitMode === 'equal'}
              onClick={() => setSplitMode('equal')}
            >
              Equal Split
            </SplitModeTab>
            <SplitModeTab
              type="button"
              $active={splitMode === 'exact'}
              onClick={() => setSplitMode('exact')}
            >
              Exact Amounts
            </SplitModeTab>
            <SplitModeTab
              type="button"
              $active={splitMode === 'percentage'}
              onClick={() => setSplitMode('percentage')}
            >
              Percentage (%)
            </SplitModeTab>
          </SplitModeTabs>
        </div>

        {/* Dynamic Per-Member Split Calculator Box */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {splitMode === 'exact' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Badge
                tone={
                  Math.abs(allocatedAmount - numericAmount) <= 0.02 &&
                  numericAmount > 0
                    ? 'positive'
                    : 'warning'
                }
              >
                Allocated {formatCurrency(allocatedAmount, currency)} of{' '}
                {formatCurrency(numericAmount, currency)}
              </Badge>
              <button
                type="button"
                onClick={fillEqualIntoExact}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Auto-fill equal amounts
              </button>
            </div>
          ) : null}

          {splitMode === 'percentage' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Badge
                  tone={Math.abs(allocatedPct - 100) <= 0.05 ? 'positive' : 'warning'}
                >
                  Total: {allocatedPct}% of 100%
                </Badge>
                <button
                  type="button"
                  onClick={fillEvenPercentages}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--brand-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Distribute 100% evenly
                </button>
              </div>
              <MeterTrack $height="6px">
                <MeterFill
                  $pct={allocatedPct}
                  $color={
                    Math.abs(allocatedPct - 100) <= 0.05
                      ? 'var(--positive-ink)'
                      : 'var(--warning-ink)'
                  }
                />
              </MeterTrack>
            </div>
          ) : null}

          {selectedIds.map((memberId) => {
            const person = members.find((m) => m.id === memberId);
            const splitObj = computedSplits.find((s) => s.memberId === memberId);

            return (
              <div
                key={memberId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '8px 10px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <Avatar
                    name={person?.name || memberId}
                    color={person?.color || '#0f766e'}
                    size="sm"
                  />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                      {person?.name}
                    </div>
                    <div
                      className="tabular-nums"
                      style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}
                    >
                      Share: {formatCurrency(splitObj?.amount || 0, currency)} (
                      {splitObj?.percentage || 0}%)
                    </div>
                  </div>
                </div>

                {splitMode === 'equal' ? (
                  <span
                    className="tabular-nums"
                    style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {formatCurrency(splitObj?.amount || 0, currency)}
                  </span>
                ) : null}

                {splitMode === 'exact' ? (
                  <div style={{ width: '135px' }}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input tabular-nums"
                      placeholder="0.00"
                      value={exactMap[memberId] ?? ''}
                      onChange={(e) =>
                        setExactMap((prev) => ({
                          ...prev,
                          [memberId]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : null}

                {splitMode === 'percentage' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '120px',
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="form-input tabular-nums"
                      placeholder="0"
                      value={pctMap[memberId] ?? ''}
                      onChange={(e) =>
                        setPctMap((prev) => ({
                          ...prev,
                          [memberId]: e.target.value,
                        }))
                      }
                    />
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      %
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="exp-notes">
            Notes (Optional)
          </label>
          <input
            id="exp-notes"
            type="text"
            className="form-input"
            placeholder="Receipt details, room allocation, or payment reference"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
