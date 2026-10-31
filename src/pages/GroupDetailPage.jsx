import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Plus,
  UserPlus,
  Receipt,
  Users,
  Wallet,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ExpenseItem from '../components/expenses/ExpenseItem';
import SettleUpModal from '../components/expenses/SettleUpModal';
import {
  SettlementTicket,
  MeterTrack,
  MeterFill,
} from '../components/styled/FinanceWidgets';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import { filterAndSortExpenses } from '../utils/expenseCalculations';
import styles from './Groups.module.css';

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const {
    groupSummaries,
    members,
    activeUserId,
    currency,
    openExpenseModal,
    deleteExpense,
    addMemberToGroup,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState('expenses');
  const [settlePreset, setSettlePreset] = useState(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberHandle, setNewMemberHandle] = useState('');

  const group = useMemo(
    () => groupSummaries.find((g) => g.id === groupId),
    [groupSummaries, groupId]
  );

  const sortedGroupExpenses = useMemo(
    () =>
      group
        ? filterAndSortExpenses(group.expenses, { sortBy: 'date-desc' })
        : [],
    [group]
  );

  const nonGroupMembers = useMemo(() => {
    if (!group) return [];
    return members.filter((m) => !group.memberIds.includes(m.id));
  }, [members, group]);

  if (!group) {
    return (
      <EmptyState
        icon={Users}
        title="Group not found"
        description="The group you requested does not exist or was removed."
        action={
          <Button
            variant="primary"
            icon={ArrowLeft}
            onClick={() => navigate('/groups')}
          >
            Back to Groups
          </Button>
        }
      />
    );
  }

  const maxAbsNet = Math.max(
    1,
    ...group.ledger.map((entry) => Math.abs(entry.netBalance))
  );

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!selectedExistingId && !newMemberName.trim()) return;
    addMemberToGroup(group.id, {
      existingMemberId: selectedExistingId,
      newName: newMemberName,
      newHandle: newMemberHandle,
    });
    setSelectedExistingId('');
    setNewMemberName('');
    setNewMemberHandle('');
    setAddMemberOpen(false);
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumb}>
        <Link to="/groups" className={styles.breadcrumbLink}>
          Shared Groups
        </Link>
        <ChevronRight size={14} />
        <span>{group.name}</span>
      </div>

      {/* Group Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">{group.name}</h1>
            <Badge tone="brand">{group.type}</Badge>
          </div>
          <p className="page-subtitle">
            {group.description || 'Shared expense group'} • Created{' '}
            {formatShortDate(group.createdAt)}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            variant="secondary"
            icon={UserPlus}
            onClick={() => setAddMemberOpen(true)}
          >
            Add Member
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openExpenseModal({ defaultGroupId: group.id })}
          >
            Add Group Expense
          </Button>
        </div>
      </div>

      {/* Group KPI Strip */}
      <div className="grid-4" style={{ marginBottom: '22px' }}>
        <StatCard
          label="Total Group Spend"
          value={formatCurrency(group.totalSpend, currency)}
          subtext={`${group.expenseCount} shared bills`}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="Members"
          value={String(group.members.length)}
          subtext={group.members.map((m) => m.name.split(' ')[0]).join(', ')}
          icon={Users}
          tone="neutral"
        />
        <StatCard
          label="Your Group Net"
          value={`${group.activeUserNet > 0.01 ? '+' : ''}${formatCurrency(
            group.activeUserNet,
            currency
          )}`}
          subtext={
            group.activeUserNet > 0.01
              ? 'Group owes you'
              : group.activeUserNet < -0.01
              ? 'You owe in this group'
              : 'Settled in this group'
          }
          icon={Receipt}
          tone={
            group.activeUserNet > 0.01
              ? 'positive'
              : group.activeUserNet < -0.01
              ? 'negative'
              : 'neutral'
          }
        />
        <StatCard
          label="Settle-Up Transfers"
          value={String(group.transfers.length)}
          subtext={
            group.allSettled
              ? 'All balances zeroed'
              : 'Simplified repayments left'
          }
          icon={CheckCircle2}
          tone={group.allSettled ? 'positive' : 'neutral'}
        />
      </div>

      {/* Section Tabs */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === 'expenses' ? styles.tabBtnActive : ''
          }`}
          onClick={() => setActiveTab('expenses')}
        >
          Group Expenses ({group.expenseCount})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === 'balances' ? styles.tabBtnActive : ''
          }`}
          onClick={() => setActiveTab('balances')}
        >
          Member Balances ({group.members.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === 'settle' ? styles.tabBtnActive : ''
          }`}
          onClick={() => setActiveTab('settle')}
        >
          Settle Up ({group.transfers.length})
        </button>
      </div>

      {/* Tab 1: Group Expenses */}
      {activeTab === 'expenses' ? (
        <Card>
          <CardHeader
            title="Group Expense Ledger"
            subtitle="Every shared bill recorded inside this group"
            action={
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => openExpenseModal({ defaultGroupId: group.id })}
              >
                New Bill
              </Button>
            }
          />

          {sortedGroupExpenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses in this group yet"
              description="Log your first shared expense to compute member shares."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => openExpenseModal({ defaultGroupId: group.id })}
                >
                  Add Expense
                </Button>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sortedGroupExpenses.map((exp) => (
                <ExpenseItem
                  key={exp.id}
                  expense={exp}
                  members={members}
                  group={group}
                  activeUserId={activeUserId}
                  currency={currency}
                  showGroupLink={false}
                  onEdit={(target) =>
                    openExpenseModal({ editingExpense: target })
                  }
                  onDelete={deleteExpense}
                />
              ))}
            </div>
          )}
        </Card>
      ) : null}

      {/* Tab 2: Member Balances */}
      {activeTab === 'balances' ? (
        <Card>
          <CardHeader
            title="Member Paid vs. Share Breakdown"
            subtitle="Net balance = Total Paid − Fair Share + Settlements"
          />
          <div className={styles.memberBalanceList}>
            {group.ledger.map((entry) => {
              const barPct = Math.round(
                (Math.abs(entry.netBalance) / maxAbsNet) * 100
              );
              const isPos = entry.netBalance > 0.01;
              const isNeg = entry.netBalance < -0.01;

              return (
                <div key={entry.memberId} className={styles.memberBalanceRow}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: '210px',
                    }}
                  >
                    <Avatar
                      name={entry.member.name}
                      color={entry.member.color}
                      size="md"
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                        {entry.member.name}
                        {entry.memberId === activeUserId ? ' (You)' : ''}
                      </div>
                      <div
                        className="tabular-nums"
                        style={{
                          fontSize: '0.77rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Paid {formatCurrency(entry.totalPaid, currency)} • Share{' '}
                        {formatCurrency(entry.totalShare, currency)}
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '160px', maxWidth: '300px' }}>
                    <MeterTrack $height="8px">
                      <MeterFill
                        $pct={barPct}
                        $color={
                          isPos
                            ? 'var(--positive-ink)'
                            : isNeg
                            ? 'var(--negative-ink)'
                            : '#94a3b8'
                        }
                      />
                    </MeterTrack>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '130px' }}>
                    <Badge
                      tone={isPos ? 'positive' : isNeg ? 'negative' : 'neutral'}
                    >
                      {isPos
                        ? `Gets back ${formatCurrency(entry.netBalance, currency)}`
                        : isNeg
                        ? `Owes ${formatCurrency(
                            Math.abs(entry.netBalance),
                            currency
                          )}`
                        : 'Settled (0)'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {/* Tab 3: Group Settle Up */}
      {activeTab === 'settle' ? (
        <Card>
          <CardHeader
            title="Simplified Group Repayments"
            subtitle="Optimized minimum transfers to settle everyone in this group"
          />

          {group.transfers.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All members are settled up!"
              description="No outstanding balances remain in this group."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.transfers.map((tr) => {
                const involvesActive =
                  tr.fromId === activeUserId || tr.toId === activeUserId;
                const direction =
                  tr.toId === activeUserId
                    ? 'incoming'
                    : tr.fromId === activeUserId
                    ? 'outgoing'
                    : 'neutral';

                return (
                  <SettlementTicket
                    key={tr.id}
                    $involvesActive={involvesActive}
                    $direction={direction}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Avatar
                        name={tr.fromMember.name}
                        color={tr.fromMember.color}
                        size="sm"
                      />
                      <div style={{ fontSize: '0.88rem' }}>
                        <strong>{tr.fromMember.name}</strong> pays{' '}
                        <strong>{tr.toMember.name}</strong>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          UPI Handle: {tr.toMember.handle || 'Direct transfer'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <span
                        className="tabular-nums"
                        style={{ fontSize: '1.05rem', fontWeight: 700 }}
                      >
                        {formatCurrency(tr.amount, currency)}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          setSettlePreset({ ...tr, groupId: group.id })
                        }
                      >
                        Record Paid
                      </Button>
                    </div>
                  </SettlementTicket>
                );
              })}
            </div>
          )}
        </Card>
      ) : null}

      {/* Add Member to Group Modal */}
      <Modal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        size="sm"
        title={`Add Member to ${group.name}`}
        subtitle="Select an existing contact or create a new participant"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMemberSubmit}>
              Add to Group
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleAddMemberSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {nonGroupMembers.length > 0 ? (
            <div className="form-field">
              <label className="form-label" htmlFor="existing-member">
                Pick Existing Person
              </label>
              <select
                id="existing-member"
                className="form-select"
                value={selectedExistingId}
                onChange={(e) => {
                  setSelectedExistingId(e.target.value);
                  if (e.target.value) setNewMemberName('');
                }}
              >
                <option value="">-- Or create a new member below --</option>
                {nonGroupMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.handle})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="form-field">
            <label className="form-label" htmlFor="new-member-name">
              New Member Full Name
            </label>
            <input
              id="new-member-name"
              type="text"
              className="form-input"
              placeholder="e.g., Ananya Bose"
              value={newMemberName}
              onChange={(e) => {
                setNewMemberName(e.target.value);
                if (e.target.value) setSelectedExistingId('');
              }}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="new-member-handle">
              Payment / UPI Handle (Optional)
            </label>
            <input
              id="new-member-handle"
              type="text"
              className="form-input"
              placeholder="e.g., ananya@okaxis"
              value={newMemberHandle}
              onChange={(e) => setNewMemberHandle(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      <SettleUpModal
        isOpen={Boolean(settlePreset)}
        onClose={() => setSettlePreset(null)}
        presetTransfer={settlePreset}
        defaultGroupId={group.id}
      />
    </div>
  );
}
