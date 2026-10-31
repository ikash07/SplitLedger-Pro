import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  ArrowLeftRight,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import ExpenseItem from '../components/expenses/ExpenseItem';
import SettleUpModal from '../components/expenses/SettleUpModal';
import CreateGroupModal from '../components/expenses/CreateGroupModal';
import {
  NetBalanceBanner,
  SettlementTicket,
  MeterTrack,
  MeterFill,
} from '../components/styled/FinanceWidgets';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import {
  calculateCategoryBreakdown,
  filterAndSortExpenses,
} from '../utils/expenseCalculations';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    activeUser,
    activeUserId,
    activeUserSummary,
    groupSummaries,
    expenses,
    groups,
    members,
    overallTransfers,
    currency,
    openExpenseModal,
    deleteExpense,
  } = useExpenses();

  const [settlePreset, setSettlePreset] = useState(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const recentExpenses = useMemo(
    () => filterAndSortExpenses(expenses, { sortBy: 'date-desc' }).slice(0, 4),
    [expenses]
  );

  const topCategories = useMemo(
    () => calculateCategoryBreakdown(expenses).slice(0, 4),
    [expenses]
  );

  const groupMap = useMemo(
    () => new Map(groups.map((g) => [g.id, g])),
    [groups]
  );

  const net = activeUserSummary.netBalance;

  return (
    <div>
      {/* Prop-Driven Styled Banner */}
      <NetBalanceBanner $net={net}>
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
            }}
          >
            Personal Ledger Summary • {activeUser?.name}
          </span>
          <h1
            className="tabular-nums"
            style={{ fontSize: 'clamp(1.35rem, 2.3vw, 1.75rem)', marginTop: '4px' }}
          >
            {net > 0.01
              ? `Overall, friends owe you ${formatCurrency(net, currency)}`
              : net < -0.01
              ? `Overall, you owe ${formatCurrency(Math.abs(net), currency)}`
              : 'You are completely settled up across all groups'}
          </h1>
          <p
            style={{
              marginTop: '4px',
              fontSize: '0.86rem',
              color: 'var(--text-secondary)',
            }}
          >
            {activeUserSummary.owedToYou > 0 || activeUserSummary.youOwe > 0 ? (
              <span className="tabular-nums">
                Owed to you in groups:{' '}
                <strong style={{ color: 'var(--positive-ink)' }}>
                  {formatCurrency(activeUserSummary.owedToYou, currency)}
                </strong>{' '}
                • You owe in groups:{' '}
                <strong style={{ color: 'var(--negative-ink)' }}>
                  {formatCurrency(activeUserSummary.youOwe, currency)}
                </strong>
              </span>
            ) : (
              'Every shared bill has been reconciled.'
            )}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            variant="secondary"
            icon={ArrowLeftRight}
            onClick={() => navigate('/settlements')}
          >
            Settle Up
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openExpenseModal()}
          >
            Log Expense
          </Button>
        </div>
      </NetBalanceBanner>

      {/* 4 KPI StatCards */}
      <div className="grid-4">
        <StatCard
          label="Total Group Spend"
          value={formatCurrency(activeUserSummary.totalGroupSpend, currency)}
          subtext={`Across ${groups.length} active groups`}
          icon={Layers}
          tone="brand"
        />
        <StatCard
          label="Total You Paid"
          value={formatCurrency(activeUserSummary.totalPaid, currency)}
          subtext="Bills fronted by you"
          icon={Wallet}
          tone="neutral"
        />
        <StatCard
          label="Your Fair Share"
          value={formatCurrency(activeUserSummary.totalShare, currency)}
          subtext="Your portion of splits"
          icon={TrendingDown}
          tone="neutral"
        />
        <StatCard
          label="Net Balance"
          value={`${net > 0.01 ? '+' : ''}${formatCurrency(net, currency)}`}
          subtext={
            net > 0.01
              ? 'Net creditor position'
              : net < -0.01
              ? 'Net debtor position'
              : 'Balanced to zero'
          }
          icon={TrendingUp}
          tone={net > 0.01 ? 'positive' : net < -0.01 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Main Two-Column Content */}
      <div className={styles.dashboardLayout}>
        <div className={styles.columnStack}>
          {/* Active Groups Card */}
          <Card>
            <CardHeader
              title="Shared Groups"
              subtitle="Click any group to inspect member balances & split bills"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => setCreateGroupOpen(true)}
                >
                  New Group
                </Button>
              }
            />

            <div className={styles.groupMiniGrid}>
              {groupSummaries.map((grp) => (
                <Link
                  key={grp.id}
                  to={`/groups/${grp.id}`}
                  className={styles.groupMiniCard}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '6px',
                      }}
                    >
                      <Badge tone="brand">{grp.type}</Badge>
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {grp.expenseCount} bills
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {grp.name}
                    </h4>
                    <div
                      className="tabular-nums"
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        marginTop: '3px',
                      }}
                    >
                      Total: {formatCurrency(grp.totalSpend, currency)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <AvatarStack members={grp.members} size="xs" max={4} />
                    <Badge
                      tone={
                        grp.activeUserNet > 0.01
                          ? 'positive'
                          : grp.activeUserNet < -0.01
                          ? 'negative'
                          : 'neutral'
                      }
                    >
                      {grp.activeUserNet > 0.01
                        ? `+${formatCurrency(grp.activeUserNet, currency)}`
                        : grp.activeUserNet < -0.01
                        ? formatCurrency(grp.activeUserNet, currency)
                        : 'Settled'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Expenses Ledger Preview */}
          <Card>
            <CardHeader
              title="Recent Expenses"
              subtitle="Click any item to inspect participant split shares"
              action={
                <Link
                  to="/expenses"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--brand-primary)',
                  }}
                >
                  <span>Full Ledger</span>
                  <ArrowRight size={15} />
                </Link>
              }
            />

            {recentExpenses.length === 0 ? (
              <EmptyState
                title="No expenses logged yet"
                description="Add your first shared bill to start calculating splits."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => openExpenseModal()}
                  >
                    Add First Expense
                  </Button>
                }
              />
            ) : (
              <div className={styles.expenseFeed}>
                {recentExpenses.map((exp) => (
                  <ExpenseItem
                    key={exp.id}
                    expense={exp}
                    members={members}
                    group={groupMap.get(exp.groupId)}
                    activeUserId={activeUserId}
                    currency={currency}
                    onEdit={(target) =>
                      openExpenseModal({ editingExpense: target })
                    }
                    onDelete={deleteExpense}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Simplified Settlements & Top Categories */}
        <div className={styles.columnStack}>
          <Card>
            <CardHeader
              title="Recommended Settle-Up"
              subtitle="Minimum transfers to clear balances"
              action={
                <Link
                  to="/settlements"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--brand-primary)',
                  }}
                >
                  All details →
                </Link>
              }
            />

            {overallTransfers.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Everyone is settled!"
                description="Zero pending repayments across all groups."
              />
            ) : (
              <div className={styles.settlementStack}>
                {overallTransfers.map((tr) => {
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
                          gap: '9px',
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          name={tr.fromMember.name}
                          color={tr.fromMember.color}
                          size="sm"
                        />
                        <div style={{ fontSize: '0.83rem' }}>
                          <div>
                            <strong>
                              {tr.fromId === activeUserId
                                ? 'You'
                                : tr.fromMember.name.split(' ')[0]}
                            </strong>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>
                              owes
                            </span>{' '}
                            <strong>
                              {tr.toId === activeUserId
                                ? 'You'
                                : tr.toMember.name.split(' ')[0]}
                            </strong>
                          </div>
                          <div
                            className="tabular-nums"
                            style={{
                              fontWeight: 700,
                              fontSize: '0.92rem',
                              color:
                                direction === 'incoming'
                                  ? 'var(--positive-ink)'
                                  : direction === 'outgoing'
                                  ? 'var(--negative-ink)'
                                  : 'var(--text-primary)',
                            }}
                          >
                            {formatCurrency(tr.amount, currency)}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={involvesActive ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setSettlePreset(tr)}
                      >
                        Settle
                      </Button>
                    </SettlementTicket>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Top Categories Mini Card */}
          <Card>
            <CardHeader
              title="Spending by Category"
              subtitle="Share of total tracked bills"
              action={
                <Link
                  to="/analytics"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--brand-primary)',
                  }}
                >
                  Analytics →
                </Link>
              }
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {topCategories.map((cat) => (
                <div key={cat.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      marginBottom: '5px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{cat.label}</span>
                    <span className="tabular-nums" style={{ fontWeight: 700 }}>
                      {formatCurrency(cat.amount, currency)}{' '}
                      <span
                        style={{
                          fontWeight: 500,
                          color: 'var(--text-muted)',
                        }}
                      >
                        ({cat.percentage}%)
                      </span>
                    </span>
                  </div>
                  <MeterTrack $height="7px">
                    <MeterFill $pct={cat.percentage} $color={cat.color} />
                  </MeterTrack>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <SettleUpModal
        isOpen={Boolean(settlePreset)}
        onClose={() => setSettlePreset(null)}
        presetTransfer={settlePreset}
      />

      <CreateGroupModal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreated={(grp) => navigate(`/groups/${grp.id}`)}
      />
    </div>
  );
}
