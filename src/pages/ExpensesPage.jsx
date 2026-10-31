import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Download,
  Plus,
  FilterX,
  Receipt,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ExpenseItem from '../components/expenses/ExpenseItem';
import { EXPENSE_CATEGORIES } from '../data/seedData';
import { useExpenses } from '../context/ExpenseContext';
import {
  filterAndSortExpenses,
  roundCurrency,
} from '../utils/expenseCalculations';
import {
  formatCurrency,
  exportExpensesToCsv,
} from '../utils/formatters';

export default function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    expenses,
    groups,
    members,
    activeUserId,
    currency,
    openExpenseModal,
    deleteExpense,
  } = useExpenses();

  const [query, setQuery] = useState(searchParams.get('q') || '');

  const groupId = searchParams.get('group') || 'ALL';
  const category = searchParams.get('category') || 'ALL';
  const paidBy = searchParams.get('payer') || 'ALL';
  const splitMode = searchParams.get('mode') || 'ALL';
  const sortBy = searchParams.get('sort') || 'date-desc';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL' || (key === 'sort' && value === 'date-desc')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredExpenses = useMemo(
    () =>
      filterAndSortExpenses(expenses, {
        query,
        groupId,
        category,
        paidBy,
        splitMode,
        sortBy,
      }),
    [expenses, query, groupId, category, paidBy, splitMode, sortBy]
  );

  const filteredTotal = useMemo(
    () =>
      roundCurrency(
        filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
      ),
    [filteredExpenses]
  );

  const groupMap = useMemo(
    () => new Map(groups.map((g) => [g.id, g])),
    [groups]
  );

  const hasActiveFilters =
    Boolean(query.trim()) ||
    groupId !== 'ALL' ||
    category !== 'ALL' ||
    paidBy !== 'ALL' ||
    splitMode !== 'ALL';

  const handleClearFilters = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses Ledger</h1>
          <p className="page-subtitle">
            Search, filter, sort, edit, or export itemized shared bills across all groups
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            variant="secondary"
            icon={Download}
            disabled={filteredExpenses.length === 0}
            onClick={() =>
              exportExpensesToCsv(filteredExpenses, members, groups, currency)
            }
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() =>
              openExpenseModal({
                defaultGroupId: groupId !== 'ALL' ? groupId : '',
              })
            }
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Multi-Criteria Filter & Sort Bar */}
      <Card padding="md" style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            alignItems: 'end',
          }}
        >
          <div className="form-field" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="ledger-search">
              Search Description or Notes
            </label>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="ledger-search"
                type="text"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="Search e.g. Homestay, Rent, Cab, Dinner..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="filter-group">
              Group
            </label>
            <select
              id="filter-group"
              className="form-select"
              value={groupId}
              onChange={(e) => updateParam('group', e.target.value)}
            >
              <option value="ALL">All Groups</option>
              {groups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="filter-category">
              Category
            </label>
            <select
              id="filter-category"
              className="form-select"
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="filter-payer">
              Paid By
            </label>
            <select
              id="filter-payer"
              className="form-select"
              value={paidBy}
              onChange={(e) => updateParam('payer', e.target.value)}
            >
              <option value="ALL">Anyone</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="filter-mode">
              Split Mode
            </label>
            <select
              id="filter-mode"
              className="form-select"
              value={splitMode}
              onChange={(e) => updateParam('mode', e.target.value)}
            >
              <option value="ALL">All Modes</option>
              <option value="equal">Equal Split</option>
              <option value="exact">Exact Amounts</option>
              <option value="percentage">Percentage %</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="filter-sort">
              Sort Order
            </label>
            <select
              id="filter-sort"
              className="form-select"
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="title-asc">Title (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Summary & Active Filter Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span>
              Showing <strong>{filteredExpenses.length}</strong> of{' '}
              {expenses.length} expenses
            </span>
            <Badge tone="brand">
              Filtered Sum: {formatCurrency(filteredTotal, currency)}
            </Badge>
          </div>

          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              icon={FilterX}
              onClick={handleClearFilters}
            >
              Reset Filters
            </Button>
          ) : null}
        </div>
      </Card>

      {/* Filtered Ledger Items */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No matching expenses found"
          description="Try broadening your search criteria or clearing active filters."
          action={
            hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => openExpenseModal()}
              >
                Add Expense
              </Button>
            )
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredExpenses.map((exp) => (
            <ExpenseItem
              key={exp.id}
              expense={exp}
              members={members}
              group={groupMap.get(exp.groupId)}
              activeUserId={activeUserId}
              currency={currency}
              onEdit={(target) => openExpenseModal({ editingExpense: target })}
              onDelete={deleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
}
