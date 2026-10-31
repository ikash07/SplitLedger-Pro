import React, { useMemo } from 'react';
import { PieChart, TrendingUp, DollarSign, Award, Layers } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { CategoryBreakdown } from '../components/analytics/CategoryBreakdown';
import { SpendingTrends } from '../components/analytics/SpendingTrends';
import { formatCurrency } from '../utils/formatters';

export const AnalyticsPage = () => {
  const { scopedExpenses, scopedMembers, totalSpend, activeGroup } = useExpenses();

  // Compute analytics metrics using JS Array methods: reduce, sort, find
  const metrics = useMemo(() => {
    const count = scopedExpenses.length;
    const avgExpense = count > 0 ? totalSpend / count : 0;

    // Find highest single expense using sort
    const highestExpense = [...scopedExpenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0] || null;

    return {
      count,
      avgExpense: Math.round(avgExpense * 100) / 100,
      highestExpense
    };
  }, [scopedExpenses, totalSpend]);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem' }}>Spending Insights & Analytics</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Deep dive into category distribution, member contributions, and expense trends for{' '}
          <strong style={{ color: '#ffffff' }}>{activeGroup ? activeGroup.name : 'All Groups'}</strong>
        </p>
      </div>

      {/* Analytics KPI Widgets */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <StatCard
          label="Total Spending"
          value={formatCurrency(totalSpend)}
          subtitle="Cumulative group expenditure"
          variant="primary"
          icon={DollarSign}
        />

        <StatCard
          label="Average Bill Amount"
          value={formatCurrency(metrics.avgExpense)}
          subtitle={`Across ${metrics.count} total bills`}
          variant="cyan"
          icon={TrendingUp}
        />

        <StatCard
          label="Top Single Expense"
          value={metrics.highestExpense ? formatCurrency(metrics.highestExpense.amount) : '$0.00'}
          subtitle={metrics.highestExpense ? metrics.highestExpense.title : 'None yet'}
          variant="success"
          icon={Award}
        />
      </div>

      {/* Analytics Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        <CategoryBreakdown />
        <SpendingTrends />
      </div>
    </div>
  );
};
