import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  History,
  Trash2,
  Plus,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import SettleUpModal from '../components/expenses/SettleUpModal';
import {
  SettlementTicket,
  MeterTrack,
  MeterFill,
} from '../components/styled/FinanceWidgets';
import { useExpenses } from '../context/ExpenseContext';
import { countRawDebtEdges } from '../utils/expenseCalculations';
import { formatCurrency, formatShortDate } from '../utils/formatters';

export default function SettlementsPage() {
  const {
    members,
    groups,
    expenses,
    settlements,
    overallLedger,
    overallTransfers,
    groupSummaries,
    activeUserId,
    currency,
    deleteSettlement,
  } = useExpenses();

  const [scopeGroupId, setScopeGroupId] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [presetTransfer, setPresetTransfer] = useState(null);

  const activeScope = useMemo(() => {
    if (scopeGroupId === 'ALL') {
      return {
        ledger: overallLedger,
        transfers: overallTransfers,
        rawEdges: countRawDebtEdges(expenses),
        history: settlements,
      };
    }

    const foundGroup = groupSummaries.find((g) => g.id === scopeGroupId);
    if (!foundGroup) {
      return {
        ledger: overallLedger,
        transfers: overallTransfers,
        rawEdges: 0,
        history: [],
      };
    }

    return {
      ledger: foundGroup.ledger,
      transfers: foundGroup.transfers,
      rawEdges: countRawDebtEdges(foundGroup.expenses),
      history: foundGroup.settlements,
    };
  }, [
    scopeGroupId,
    overallLedger,
    overallTransfers,
    expenses,
    settlements,
    groupSummaries,
  ]);

  const memberMap = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );

  const groupMap = useMemo(
    () => new Map(groups.map((g) => [g.id, g])),
    [groups]
  );

  const maxAbsBalance = Math.max(
    1,
    ...activeScope.ledger.map((l) => Math.abs(l.netBalance))
  );

  const savedEdges = Math.max(
    0,
    activeScope.rawEdges - activeScope.transfers.length
  );

  const openCustomSettlement = () => {
    setPresetTransfer(null);
    setModalOpen(true);
  };

  const openPresetSettlement = (tr) => {
    setPresetTransfer({
      ...tr,
      groupId: scopeGroupId !== 'ALL' ? scopeGroupId : groups[0]?.id,
    });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Settle-Up Center</h1>
          <p className="page-subtitle">
            Minimum-cash-flow debt simplification reduces circular IOUs into optimal repayments
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <select
            aria-label="Filter settlement scope"
            className="form-select"
            style={{ width: 'auto', minWidth: '210px' }}
            value={scopeGroupId}
            onChange={(e) => setScopeGroupId(e.target.value)}
          >
            <option value="ALL">All Groups Combined</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            icon={Plus}
            onClick={openCustomSettlement}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Debt Simplification Metrics */}
      <div className="grid-4" style={{ marginBottom: '22px' }}>
        <StatCard
          label="Raw Split IOUs"
          value={String(activeScope.rawEdges)}
          subtext="Individual expense obligations"
          icon={ArrowLeftRight}
          tone="neutral"
        />
        <StatCard
          label="Optimized Transfers"
          value={String(activeScope.transfers.length)}
          subtext="Minimum payments needed"
          icon={Sparkles}
          tone="brand"
        />
        <StatCard
          label="Payments Eliminated"
          value={String(savedEdges)}
          subtext="Redundant transfers saved"
          icon={CheckCircle2}
          tone="positive"
        />
        <StatCard
          label="Recorded Settlements"
          value={String(activeScope.history.length)}
          subtext="Verified repayments logged"
          icon={History}
          tone="neutral"
        />
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Recommended Transfers + History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <CardHeader
              title="Recommended Repayments"
              subtitle="Click Settle Now once a payment is completed via UPI, bank, or cash"
            />

            {activeScope.transfers.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Zero pending repayments!"
                description="Every member's net balance is completely settled."
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {activeScope.transfers.map((tr) => {
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
                          gap: '11px',
                        }}
                      >
                        <Avatar
                          name={tr.fromMember.name}
                          color={tr.fromMember.color}
                          size="md"
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem' }}>
                            <strong>
                              {tr.fromId === activeUserId
                                ? 'You'
                                : tr.fromMember.name}
                            </strong>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>
                              pay
                            </span>{' '}
                            <strong>
                              {tr.toId === activeUserId
                                ? 'You'
                                : tr.toMember.name}
                            </strong>
                          </div>
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            Recipient UPI: {tr.toMember.handle}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '1.08rem',
                            fontWeight: 700,
                            color:
                              direction === 'incoming'
                                ? 'var(--positive-ink)'
                                : direction === 'outgoing'
                                ? 'var(--negative-ink)'
                                : 'var(--text-primary)',
                          }}
                        >
                          {formatCurrency(tr.amount, currency)}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openPresetSettlement(tr)}
                        >
                          Settle Now
                        </Button>
                      </div>
                    </SettlementTicket>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Completed Settlements History */}
          <Card>
            <CardHeader
              title="Completed Settlement History"
              subtitle="Verified direct payments recorded between members"
            />

            {activeScope.history.length === 0 ? (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  padding: '8px 0',
                }}
              >
                No completed settlement payments recorded for this scope yet.
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {activeScope.history.map((stl) => {
                  const payer = memberMap.get(stl.fromMemberId);
                  const receiver = memberMap.get(stl.toMemberId);
                  const grp = groupMap.get(stl.groupId);

                  return (
                    <div
                      key={stl.id}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                          {payer?.name || stl.fromMemberId} paid{' '}
                          {receiver?.name || stl.toMemberId}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {formatShortDate(stl.date)} • {stl.method}
                          {grp ? ` • ${grp.name}` : ''}
                          {stl.note ? ` • "${stl.note}"` : ''}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Badge tone="positive">
                          {formatCurrency(stl.amount, currency)}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => deleteSettlement(stl.id)}
                          title="Delete settlement record"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Member Net Ledger */}
        <Card>
          <CardHeader
            title="Net Member Positions"
            subtitle="Creditors (+ green) receive money; Debtors (− rose) send money"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeScope.ledger
              .slice()
              .sort((a, b) => b.netBalance - a.netBalance)
              .map((entry) => {
                const isPos = entry.netBalance > 0.01;
                const isNeg = entry.netBalance < -0.01;
                const pct = Math.round(
                  (Math.abs(entry.netBalance) / maxAbsBalance) * 100
                );

                return (
                  <div
                    key={entry.memberId}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Avatar
                          name={entry.member.name}
                          color={entry.member.color}
                          size="sm"
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                            {entry.member.name}
                            {entry.memberId === activeUserId ? ' (You)' : ''}
                          </div>
                          <div
                            className="tabular-nums"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            Paid {formatCurrency(entry.totalPaid, currency)} •
                            Share {formatCurrency(entry.totalShare, currency)}
                          </div>
                        </div>
                      </div>

                      <Badge
                        tone={isPos ? 'positive' : isNeg ? 'negative' : 'neutral'}
                      >
                        {isPos
                          ? `+${formatCurrency(entry.netBalance, currency)}`
                          : isNeg
                          ? formatCurrency(entry.netBalance, currency)
                          : '0'}
                      </Badge>
                    </div>

                    <MeterTrack $height="6px">
                      <MeterFill
                        $pct={pct}
                        $color={
                          isPos
                            ? 'var(--positive-ink)'
                            : isNeg
                            ? 'var(--negative-ink)'
                            : '#cbd5e1'
                        }
                      />
                    </MeterTrack>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      <SettleUpModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        presetTransfer={presetTransfer}
        defaultGroupId={scopeGroupId !== 'ALL' ? scopeGroupId : ''}
      />
    </div>
  );
}
