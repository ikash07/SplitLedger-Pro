import React, { useState, useMemo } from 'react';
import { PieChart, BarChart3, Layers, Receipt } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { MeterTrack, MeterFill } from '../components/styled/FinanceWidgets';
import { useExpenses } from '../context/ExpenseContext';
import {
  calculateCategoryBreakdown,
  calculateMemberLedger,
  roundCurrency,
} from '../utils/expenseCalculations';
import { formatCurrency } from '../utils/formatters';

export default function AnalyticsPage() {
  const { expenses, groups, members, settlements, groupSummaries, currency } =
    useExpenses();
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');

  const scopedExpenses = useMemo(
    () =>
      selectedGroupId === 'ALL'
        ? expenses
        : expenses.filter((e) => e.groupId === selectedGroupId),
    [expenses, selectedGroupId]
  );

  const scopedMembers = useMemo(() => {
    if (selectedGroupId === 'ALL') return members;
    const grp = groups.find((g) => g.id === selectedGroupId);
    return grp ? members.filter((m) => grp.memberIds.includes(m.id)) : members;
  }, [members, groups, selectedGroupId]);

  const scopedSettlements = useMemo(
    () =>
      selectedGroupId === 'ALL'
        ? settlements
        : settlements.filter((s) => s.groupId === selectedGroupId),
    [settlements, selectedGroupId]
  );

  const totalSpend = useMemo(
    () =>
      roundCurrency(
        scopedExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
      ),
    [scopedExpenses]
  );

  const avgBill =
    scopedExpenses.length > 0
      ? roundCurrency(totalSpend / scopedExpenses.length)
      : 0;

  const categories = useMemo(
    () => calculateCategoryBreakdown(scopedExpenses),
    [scopedExpenses]
  );

  const memberStats = useMemo(
    () =>
      calculateMemberLedger(scopedMembers, scopedExpenses, scopedSettlements),
    [scopedMembers, scopedExpenses, scopedSettlements]
  );

  const splitModeBreakdown = useMemo(() => {
    const counts = scopedExpenses.reduce(
      (acc, exp) => {
        const key = exp.splitMode || 'equal';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { equal: 0, exact: 0, percentage: 0 }
    );

    const totalCount = scopedExpenses.length || 1;
    return [
      {
        id: 'equal',
        label: 'Equal Split',
        count: counts.equal,
        pct: roundCurrency((counts.equal / totalCount) * 100),
        color: '#0f766e',
      },
      {
        id: 'exact',
        label: 'Exact Amounts',
        count: counts.exact,
        pct: roundCurrency((counts.exact / totalCount) * 100),
        color: '#2563eb',
      },
      {
        id: 'percentage',
        label: 'Percentage (%)',
        count: counts.percentage,
        pct: roundCurrency((counts.percentage / totalCount) * 100),
        color: '#d97706',
      },
    ];
  }, [scopedExpenses]);

  const maxMemberFigure = Math.max(
    1,
    ...memberStats.flatMap((m) => [m.totalPaid, m.totalShare])
  );

  // Build SVG Donut Ring segments dynamically with .reduce()
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;
  const donutSegments = categories.map((cat) => {
    const length = (cat.percentage / 100) * circumference;
    const segment = {
      ...cat,
      strokeDasharray: `${length} ${Math.max(0, circumference - length)}`,
      strokeDashoffset: -cumulativeOffset,
    };
    cumulativeOffset += length;
    return segment;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Spending Insights & Analytics</h1>
          <p className="page-subtitle">
            Visual breakdown of categories, member contributions, and split methods
          </p>
        </div>

        <select
          aria-label="Filter analytics by group"
          className="form-select"
          style={{ width: 'auto', minWidth: '220px' }}
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
        >
          <option value="ALL">All Groups Combined</option>
          {groups.map((grp) => (
            <option key={grp.id} value={grp.id}>
              {grp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary KPIs */}
      <div className="grid-4" style={{ marginBottom: '22px' }}>
        <StatCard
          label="Analyzed Spend"
          value={formatCurrency(totalSpend, currency)}
          subtext={`${scopedExpenses.length} expenses in scope`}
          icon={Layers}
          tone="brand"
        />
        <StatCard
          label="Average Expense"
          value={formatCurrency(avgBill, currency)}
          subtext="Mean shared bill size"
          icon={Receipt}
          tone="neutral"
        />
        <StatCard
          label="Top Category"
          value={categories[0]?.label || '—'}
          subtext={
            categories[0]
              ? `${formatCurrency(categories[0].amount, currency)} (${
                  categories[0].percentage
                }%)`
              : 'No data'
          }
          icon={PieChart}
          tone="neutral"
        />
        <StatCard
          label="Top Bill Payer"
          value={
            memberStats
              .slice()
              .sort((a, b) => b.totalPaid - a.totalPaid)[0]
              ?.member.name.split(' ')[0] || '—'
          }
          subtext="Most expenses fronted"
          icon={BarChart3}
          tone="positive"
        />
      </div>

      {scopedExpenses.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No expenses to analyze"
          description="Add shared bills to see category rings and member contribution charts."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Category SVG Donut + Breakdown */}
            <Card>
              <CardHeader
                title="Category Allocation"
                subtitle="Proportional distribution of shared expenses"
              />

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '168px',
                    height: '168px',
                    margin: '0 auto',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="168"
                    height="168"
                    viewBox="0 0 168 168"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    <circle
                      cx="84"
                      cy="84"
                      r={radius}
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="20"
                    />
                    {donutSegments.map((seg) => (
                      <circle
                        key={seg.id}
                        cx="84"
                        cy="84"
                        r={radius}
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="20"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                      />
                    ))}
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Total
                    </span>
                    <span
                      className="tabular-nums"
                      style={{ fontSize: '0.96rem', fontWeight: 800 }}
                    >
                      {formatCurrency(totalSpend, currency)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '11px',
                  }}
                >
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              backgroundColor: cat.color,
                            }}
                          />
                          {cat.label} ({cat.count})
                        </span>
                        <span
                          className="tabular-nums"
                          style={{ fontWeight: 700 }}
                        >
                          {formatCurrency(cat.amount, currency)}
                        </span>
                      </div>
                      <MeterTrack $height="6px">
                        <MeterFill $pct={cat.percentage} $color={cat.color} />
                      </MeterTrack>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Member Paid vs Consumed Share Comparison */}
            <Card>
              <CardHeader
                title="Member Paid vs. Fair Share"
                subtitle="Compares bills fronted (teal) against actual share consumed (slate)"
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}
              >
                {memberStats.map((entry) => {
                  const paidPct = Math.round(
                    (entry.totalPaid / maxMemberFigure) * 100
                  );
                  const sharePct = Math.round(
                    (entry.totalShare / maxMemberFigure) * 100
                  );

                  return (
                    <div key={entry.memberId}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Avatar
                            name={entry.member.name}
                            color={entry.member.color}
                            size="xs"
                          />
                          <span
                            style={{ fontSize: '0.86rem', fontWeight: 700 }}
                          >
                            {entry.member.name}
                          </span>
                        </div>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Paid{' '}
                          <strong>
                            {formatCurrency(entry.totalPaid, currency)}
                          </strong>{' '}
                          / Share{' '}
                          <strong>
                            {formatCurrency(entry.totalShare, currency)}
                          </strong>
                        </span>
                      </div>

                      {/* Dual Dynamic Inline-Styled Bars */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div
                          style={{
                            height: '7px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${paidPct}%`,
                              height: '100%',
                              backgroundColor: 'var(--brand-primary)',
                              borderRadius: '999px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                        <div
                          style={{
                            height: '7px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${sharePct}%`,
                              height: '100%',
                              backgroundColor: '#64748b',
                              borderRadius: '999px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Bottom Row: Split Methods & Group Spend Volume */}
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <Card>
              <CardHeader
                title="Split Method Distribution"
                subtitle="How expenses are divided across participants"
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {splitModeBreakdown.map((mode) => (
                  <div key={mode.id}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                        fontSize: '0.84rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{mode.label}</span>
                      <Badge tone="neutral">
                        {mode.count} bills ({mode.pct}%)
                      </Badge>
                    </div>
                    <MeterTrack $height="8px">
                      <MeterFill $pct={mode.pct} $color={mode.color} />
                    </MeterTrack>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Group Spend Comparison"
                subtitle="Cumulative expenses recorded per shared group"
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {groupSummaries
                  .slice()
                  .sort((a, b) => b.totalSpend - a.totalSpend)
                  .map((grp) => {
                    const allSpend = Math.max(
                      1,
                      expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
                    );
                    const pct = roundCurrency((grp.totalSpend / allSpend) * 100);
                    return (
                      <div key={grp.id}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                            fontSize: '0.84rem',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            {grp.name} ({grp.expenseCount})
                          </span>
                          <span
                            className="tabular-nums"
                            style={{ fontWeight: 700 }}
                          >
                            {formatCurrency(grp.totalSpend, currency)} ({pct}%)
                          </span>
                        </div>
                        <MeterTrack $height="8px">
                          <MeterFill $pct={pct} $color="var(--brand-primary)" />
                        </MeterTrack>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
