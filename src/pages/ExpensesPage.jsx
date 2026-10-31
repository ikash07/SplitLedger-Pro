import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Download, FileSpreadsheet, Receipt, RefreshCw } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { filterExpenses, sortExpenses, calculateTotalSpend } from '../utils/arrayHelpers';
import { formatCurrency } from '../utils/formatters';

export const ExpensesPage = () => {
  const { expenses, categories, groups, activeGroupId, setActiveGroupId } = useExpenses();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(activeGroupId || 'all');
  const [sortOption, setSortOption] = useState('date-desc');

  // Filter using JavaScript array operations: filter, some
  const filtered = useMemo(() => {
    return filterExpenses(expenses, {
      searchTerm,
      category: selectedCategory,
      groupId: selectedGroup
    });
  }, [expenses, searchTerm, selectedCategory, selectedGroup]);

  // Sort using JavaScript array sort
  const sorted = useMemo(() => {
    return sortExpenses(filtered, sortOption);
  }, [filtered, sortOption]);

  const totalFilteredAmount = useMemo(() => {
    return calculateTotalSpend(sorted);
  }, [sorted]);

  // Export filtered expenses as CSV
  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Paid By', 'Split Type', 'Notes'];
    const rows = sorted.map(exp => [
      exp.date,
      `"${exp.title.replace(/"/g, '""')}"`,
      exp.category,
      exp.amount,
      exp.paidBy,
      exp.splitType,
      `"${(exp.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `splitmate_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: '1.75rem' 
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>All Shared Expenses</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Browse, filter, and audit {sorted.length} transactions totaling {formatCurrency(totalFilteredAmount)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button 
            variant="secondary" 
            icon={Download} 
            size="sm"
            onClick={handleExportCSV}
            disabled={sorted.length === 0}
          >
            Export CSV
          </Button>

          <Link to="/add-expense">
            <Button variant="primary" icon={PlusCircle} size="sm">
              New Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar Component */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortOption={sortOption}
        onSortChange={setSortOption}
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupChange={(val) => {
          setSelectedGroup(val);
          setActiveGroupId(val);
        }}
      />

      {/* Expense List View */}
      {sorted.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Receipt size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching expenses found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Try adjusting your search query, selecting "All Categories", or switching active group.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedGroup('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div>
          {sorted.map(expense => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}
    </div>
  );
};
