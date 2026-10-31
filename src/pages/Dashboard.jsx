import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  PlusCircle, 
  Receipt, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { DebtCard } from '../components/settlements/DebtCard';
import { CategoryBreakdown } from '../components/analytics/CategoryBreakdown';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const { 
    currentUser, 
    activeGroup, 
    activeGroupId,
    scopedExpenses, 
    simplifiedDebts, 
    currentUserNet, 
    currentUserOwed, 
    currentUserOwes, 
    totalSpend,
    scopedMembers
  } = useExpenses();

  const isNetPositive = currentUserNet >= 0;

  // Recent 4 expenses using slice and sort
  const recentExpenses = [...scopedExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Filter debts involving current user
  const myDebts = simplifiedDebts.filter(
    d => d.fromMemberId === currentUser.id || d.toMemberId === currentUser.id
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Welcome & Scope Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '2rem' }}>
              Welcome back, <span className="gradient-text">{currentUser.name.split(' ')[0]}</span>
            </h1>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
          </div>
          <p style={{ marginTop: '0.35rem', fontSize: '0.95rem' }}>
            Scope: <strong style={{ color: '#ffffff' }}>{activeGroup ? activeGroup.name : 'All Groups Combined'}</strong>
            {activeGroup && ` • ${scopedMembers.length} members`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/add-expense">
            <Button variant="primary" icon={PlusCircle}>
              Add Expense / Split
            </Button>
          </Link>
          <Link to="/settle">
            <Button variant="secondary" icon={CheckCircle2}>
              Settle Balances
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Financial Stat Cards Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <StatCard
          label="Total Net Balance"
          value={formatCurrency(currentUserNet)}
          subtitle={isNetPositive ? 'You are owed money overall' : 'You owe money overall'}
          variant={isNetPositive ? 'success' : 'danger'}
          icon={isNetPositive ? TrendingUp : TrendingDown}
          trend={
            <Badge variant={isNetPositive ? 'success' : 'danger'}>
              {isNetPositive ? 'Positive Net' : 'Action Required'}
            </Badge>
          }
        />

        <StatCard
          label="You Are Owed"
          value={formatCurrency(currentUserOwed)}
          subtitle="From your friends across groups"
          variant="success"
          icon={TrendingUp}
        />

        <StatCard
          label="You Owe"
          value={formatCurrency(currentUserOwes)}
          subtitle="To be settled with members"
          variant="danger"
          icon={TrendingDown}
        />

        <StatCard
          label="Total Group Spend"
          value={formatCurrency(totalSpend)}
          subtitle={`${scopedExpenses.length} total shared bills`}
          variant="primary"
          icon={DollarSign}
        />
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Debts & Recent Expenses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Settlement Debts */}
          <Card 
            title="Simplified Debt Settlements" 
            subtitle="Algorithmically minimized cross-payments"
            actions={
              <Link to="/settle" style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={14} />
              </Link>
            }
          >
            {simplifiedDebts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={32} color="#10B981" style={{ marginBottom: '0.5rem' }} />
                <p>All settled up! No outstanding balances in this group.</p>
              </div>
            ) : (
              <div>
                {simplifiedDebts.slice(0, 3).map(tx => (
                  <DebtCard key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </Card>

          {/* Recent Expenses */}
          <Card 
            title="Recent Shared Expenses" 
            subtitle={`Showing latest ${recentExpenses.length} records`}
            actions={
              <Link to="/expenses" style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                All Expenses <ArrowRight size={14} />
              </Link>
            }
          >
            {recentExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                No expenses recorded yet.
              </div>
            ) : (
              <div>
                {recentExpenses.map(exp => (
                  <ExpenseCard key={exp.id} expense={exp} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Category Breakdown & Active Group Members */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CategoryBreakdown />

          {/* Active Members Card */}
          <Card 
            title="Group Members" 
            subtitle={`${scopedMembers.length} active participants`}
            actions={
              <Link to="/groups" style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Manage <ArrowRight size={14} />
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {scopedMembers.map(member => (
                <div 
                  key={member.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.25rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar name={member.name} color={member.avatarColor} size={32} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                        {member.name} {member.id === currentUser.id && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                    </div>
                  </div>

                  {member.isCurrentUser ? (
                    <Badge variant="primary">Active User</Badge>
                  ) : (
                    <Badge variant="neutral">Member</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
