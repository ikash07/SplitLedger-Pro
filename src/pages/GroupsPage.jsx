import React, { useState } from 'react';
import { Users, Plus, Check, FolderPlus, UserPlus, ArrowRight, DollarSign } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calculateTotalSpend } from '../utils/arrayHelpers';

export const GroupsPage = () => {
  const { 
    groups, 
    activeGroupId, 
    setActiveGroupId, 
    members, 
    expenses, 
    addGroup, 
    addMember, 
    currentUserId 
  } = useExpenses();

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  // New Group Form State
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupCategory, setGroupCategory] = useState('travel');
  const [selectedMemberIds, setSelectedMemberIds] = useState([currentUserId]);

  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [assignGroupId, setAssignGroupId] = useState(groups[0]?.id || '');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    addGroup({
      name: groupName.trim(),
      description: groupDesc.trim(),
      category: groupCategory,
      members: selectedMemberIds
    });

    setGroupName('');
    setGroupDesc('');
    setSelectedMemberIds([currentUserId]);
    setCreateGroupModalOpen(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addMember({
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      groupId: assignGroupId
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setAddMemberModalOpen(false);
  };

  const toggleMemberSelection = (id) => {
    if (selectedMemberIds.includes(id)) {
      if (selectedMemberIds.length > 1) {
        setSelectedMemberIds(selectedMemberIds.filter(mId => mId !== id));
      }
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
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
          <h1 style={{ fontSize: '1.85rem' }}>Groups & Trips</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Organize shared expenses across flatmates, vacations, and social clubs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button 
            variant="outline" 
            icon={UserPlus} 
            size="sm"
            onClick={() => setAddMemberModalOpen(true)}
          >
            Add Member
          </Button>

          <Button 
            variant="primary" 
            icon={FolderPlus} 
            size="sm"
            onClick={() => setCreateGroupModalOpen(true)}
          >
            Create New Group
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {groups.map(grp => {
          const isActive = activeGroupId === grp.id;
          const groupExpenses = expenses.filter(e => e.groupId === grp.id);
          const totalGroupSpend = calculateTotalSpend(groupExpenses);
          const groupMembers = members.filter(m => grp.members.includes(m.id));

          return (
            <Card 
              key={grp.id}
              className={`group-card ${isActive ? 'card-glow' : ''}`}
              style={{
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-card)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>{grp.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Created on {formatDate(grp.createdAt)}
                    </p>
                  </div>

                  {isActive ? (
                    <Badge variant="primary">Active Group</Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveGroupId(grp.id)}
                    >
                      Set Active
                    </Button>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '38px' }}>
                  {grp.description || 'Shared expense group'}
                </p>

                {/* Group Financial Metrics */}
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '10px',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spent</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {formatCurrency(totalGroupSpend)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expenses</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {groupExpenses.length} bills
                    </div>
                  </div>
                </div>
              </div>

              {/* Members Avatars Row */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Members ({groupMembers.length})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginInlineStart: '6px' }}>
                    {groupMembers.map((m, idx) => (
                      <div key={m.id} style={{ marginLeft: idx > 0 ? '-8px' : '0', zIndex: 10 - idx }}>
                        <Avatar name={m.name} color={m.avatarColor} size={30} showBorder />
                      </div>
                    ))}
                  </div>

                  <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {groupMembers.map(m => m.name.split(' ')[0]).join(', ')}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Group Modal */}
      {createGroupModalOpen && (
        <Modal
          isOpen={createGroupModalOpen}
          onClose={() => setCreateGroupModalOpen(false)}
          title="Create New Expense Group"
          footer={
            <>
              <Button variant="secondary" onClick={() => setCreateGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateGroup}>
                Create Group
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Group Name</label>
              <input
                type="text"
                placeholder="e.g. Kyoto Cherry Blossom Trip 🌸"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description</label>
              <input
                type="text"
                placeholder="Brief purpose of this group..."
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                value={groupCategory}
                onChange={(e) => setGroupCategory(e.target.value)}
                className="form-select"
              >
                <option value="travel">Travel & Trips</option>
                <option value="accommodation">Flatmates / House</option>
                <option value="food">Dinners & Social</option>
                <option value="other">General</option>
              </select>
            </div>

            {/* Select Members to include */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Members</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {members.map(member => {
                  const isChecked = selectedMemberIds.includes(member.id);
                  return (
                    <div 
                      key={member.id}
                      onClick={() => toggleMemberSelection(member.id)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isChecked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Avatar name={member.name} color={member.avatarColor} size={26} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                          {member.name} {member.id === currentUserId && '(You)'}
                        </span>
                      </div>
                      {isChecked && <Check size={16} color="var(--primary)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Member Modal */}
      {addMemberModalOpen && (
        <Modal
          isOpen={addMemberModalOpen}
          onClose={() => setAddMemberModalOpen(false)}
          title="Add New Member"
          footer={
            <>
              <Button variant="secondary" onClick={() => setAddMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddMember}>
                Add Friend
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="e.g. David Miller"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. david@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Assign to Group</label>
              <select
                value={assignGroupId}
                onChange={(e) => setAssignGroupId(e.target.value)}
                className="form-select"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
