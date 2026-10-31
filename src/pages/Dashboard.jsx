import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Zap,
  HandCoins,
  PartyPopper,
  Sparkles,
  Users
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { DebtCard } from '../components/settlements/DebtCard';
import { QuickAddModal } from '../components/expenses/QuickAddModal';
import { PiggyIcon } from '../components/common/CustomIcons';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const { 
    currentUser, 
    activeGroup, 
    scopedExpenses, 
    simplifiedDebts, 
    currentUserOwed, 
    currentUserOwes, 
    totalSpend,
    scopedMembers
  } = useExpenses();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickCategory, setQuickCategory] = useState('food');

  const openQuickWithCat = (cat) => {
    setQuickCategory(cat);
    setQuickAddOpen(true);
  };

  const recentExpenses = [...scopedExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const firstName = currentUser?.name?.split(' ')[0] || 'Friend';

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>

      {/* ── Playful Welcoming Header ── */}
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={13} />
              Piggy Bank Dashboard
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              · {activeGroup ? activeGroup.name : 'All Squads Combined'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.3rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Hey, <span className="gradient-text">{firstName}</span>!</span>
            <span style={{ fontSize: '2rem' }}>🎈</span>
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Track who bought what and who needs to pay whom with zero stress!
          </p>
        </div>

        {/* Big 3D CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setQuickAddOpen(true)}
          >
            <span>➕</span>
            <span>Add a Bill</span>
          </Button>

          <Link to="/settle">
            <Button 
              variant="outline" 
              size="lg"
            >
              <span>🤝</span>
              <span>Pay Back</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 3 Big Piggy Bank Pocket Cards ── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1.25rem',
          marginBottom: '2.25rem'
        }}
      >
        {/* Card 1: Money Friends Owe You */}
        <div 
          className="glass-panel"
          style={{
            padding: '1.6rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.35)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-heading)' }}>
              FRIENDS OWE YOU
            </span>
            <span style={{ fontSize: '1.8rem' }}>💚</span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(currentUserOwed)}
          </div>

          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {currentUserOwed > 0 
              ? '🎉 Friends will pay you this money back!'
              : '🌟 Nobody owes you anything right now.'}
          </p>
        </div>

        {/* Card 2: Money You Need to Pay */}
        <div 
          className="glass-panel"
          style={{
            padding: '1.6rem',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.04) 100%)',
            borderColor: 'rgba(244, 63, 94, 0.35)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E11D48', fontFamily: 'var(--font-heading)' }}>
              YOU NEED TO PAY
            </span>
            <span style={{ fontSize: '1.8rem' }}>💸</span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#F43F5E', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(currentUserOwes)}
          </div>

          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {currentUserOwes > 0 
              ? 'Don’t forget to pay your friends back!'
              : '🎉 You are all even! You don’t owe a cent.'}
          </p>
        </div>

        {/* Card 3: Total Spent by Squad */}
        <div 
          className="glass-panel"
          style={{
            padding: '1.6rem',
            background: 'linear-gradient(135deg, rgba(255, 75, 114, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderColor: 'rgba(255, 75, 114, 0.35)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF4B72', fontFamily: 'var(--font-heading)' }}>
              TOTAL SQUAD SPEND
            </span>
            <span style={{ fontSize: '1.8rem' }}>🍕</span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FF4B72', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(totalSpend)}
          </div>

          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            All {scopedExpenses.length} shared bills combined
          </p>
        </div>
      </div>

      {/* ── 1-Tap Quick Split Bar ── */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-tertiary)',
          border: '2px solid var(--border-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              1-Tap Quick Split
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              What did you buy? Tap an icon to split in seconds!
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { emoji: '🍕', label: 'Pizza', cat: 'food' },
            { emoji: '🍿', label: 'Movies', cat: 'entertainment' },
            { emoji: '🧃', label: 'Snacks', cat: 'groceries' },
            { emoji: '🍦', label: 'Ice Cream', cat: 'food' },
            { emoji: '🚕', label: 'Cab Ride', cat: 'travel' },
            { emoji: '🎮', label: 'Games', cat: 'entertainment' }
          ].map(chip => (
            <button
              key={chip.label}
              type="button"
              onClick={() => openQuickWithCat(chip.cat)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '9999px',
                fontSize: '0.85rem',
                padding: '0.45rem 0.85rem'
              }}
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Two Columns: Who Pays Whom & Recent Bills ── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Who Pays Whom */}
        <Card 
          title="🤝 Who Pays Whom?" 
          subtitle="No math needed! Just follow these easy payments:"
          actions={
            simplifiedDebts.length > 0 && (
              <Link to="/settle" style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                See all <ArrowRight size={14} />
              </Link>
            )
          }
        >
          {simplifiedDebts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '3.2rem', marginBottom: '0.5rem' }}>🎉</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Everyone Is All Square!
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto' }}>
                Nobody owes anyone anything right now! Add a new bill whenever you buy snacks or tickets.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {simplifiedDebts.slice(0, 3).map(tx => (
                <DebtCard key={tx.id} transaction={tx} />
              ))}
              {simplifiedDebts.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <Link to="/settle" className="btn btn-secondary btn-sm">
                    +{simplifiedDebts.length - 3} more payments
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right Column: Recent Bills */}
        <Card 
          title="🍕 Recent Bills" 
          subtitle="Latest things bought and shared"
          actions={
            <Link to="/expenses" style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              See all bills <ArrowRight size={14} />
            </Link>
          }
        >
          {recentExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧾</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No bills added yet</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Click "+ Add a Bill" above to add your first expense!
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setQuickAddOpen(true)}
              >
                Add First Bill
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentExpenses.map(exp => (
                <ExpenseCard key={exp.id} expense={exp} />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <QuickAddModal 
          isOpen={quickAddOpen} 
          onClose={() => setQuickAddOpen(false)} 
          initialCategory={quickCategory}
        />
      )}
    </div>
  );
};
