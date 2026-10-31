import React, { useState } from 'react';
import { Check, UserPlus, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { ParticipantPill } from '../styled/FinanceWidgets';
import { GROUP_TYPES } from '../../data/seedData';
import { useExpenses } from '../../context/ExpenseContext';

export default function CreateGroupModal({ isOpen, onClose, onCreated }) {
  const { members, activeUserId, addGroup } = useExpenses();

  const [name, setName] = useState('');
  const [type, setType] = useState('Trip');
  const [description, setDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([
    activeUserId,
    ...members
      .filter((m) => m.id !== activeUserId)
      .slice(0, 2)
      .map((m) => m.id),
  ]);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [pendingNewNames, setPendingNewNames] = useState([]);
  const [error, setError] = useState('');

  const toggleMember = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddNewFriend = () => {
    const trimmed = newFriendInput.trim();
    if (!trimmed) return;
    if (!pendingNewNames.includes(trimmed)) {
      setPendingNewNames((prev) => [...prev, trimmed]);
    }
    setNewFriendInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter a group name.');
      return;
    }
    if (selectedMemberIds.length + pendingNewNames.length < 2) {
      setError('Select or add at least 2 members to share expenses.');
      return;
    }

    const created = addGroup({
      name,
      type,
      description,
      memberIds: selectedMemberIds,
      newMemberNames: pendingNewNames,
    });

    setName('');
    setDescription('');
    setPendingNewNames([]);
    onClose();
    if (onCreated && created) {
      onCreated(created);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Shared Group"
      subtitle="Organize trip expenses, flat bills, or event budgets with friends"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Group
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {error ? (
          <div
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--negative-bg)',
              border: '1px solid var(--negative-border)',
              color: 'var(--negative-ink)',
              fontSize: '0.83rem',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : null}

        <div className="grid-2" style={{ gap: '12px' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="grp-name">
              Group Name
            </label>
            <input
              id="grp-name"
              type="text"
              className="form-input"
              placeholder="e.g., Goa Beach Trip, Flat 2A Utilities"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="grp-type">
              Group Type
            </label>
            <select
              id="grp-type"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {GROUP_TYPES.map((gt) => (
                <option key={gt.id} value={gt.id}>
                  {gt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="grp-desc">
            Short Description
          </label>
          <input
            id="grp-desc"
            type="text"
            className="form-input"
            placeholder="What expenses will you track in this group?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <span className="form-label">Select Existing Members</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {members.map((member) => {
              const selected = selectedMemberIds.includes(member.id);
              return (
                <ParticipantPill
                  key={member.id}
                  type="button"
                  $selected={selected}
                  onClick={() => toggleMember(member.id)}
                >
                  <Avatar name={member.name} color={member.color} size="xs" />
                  <span>{member.name}</span>
                  {selected ? <Check size={14} /> : null}
                </ParticipantPill>
              );
            })}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="grp-new-member">
            Add New Participant (Optional)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="grp-new-member"
              type="text"
              className="form-input"
              placeholder="Enter friend's full name"
              value={newFriendInput}
              onChange={(e) => setNewFriendInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewFriend();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              icon={UserPlus}
              onClick={handleAddNewFriend}
            >
              Add
            </Button>
          </div>

          {pendingNewNames.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '6px',
              }}
            >
              {pendingNewNames.map((friendName) => (
                <span
                  key={friendName}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#f0fdfa',
                    border: '1px solid var(--brand-soft-border)',
                    color: 'var(--brand-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  + {friendName}
                  <button
                    type="button"
                    onClick={() =>
                      setPendingNewNames((prev) =>
                        prev.filter((n) => n !== friendName)
                      )
                    }
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                    }}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
