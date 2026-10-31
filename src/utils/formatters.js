import { CURRENCIES, EXPENSE_CATEGORIES } from '../data/seedData';

export function formatCurrency(amount, currencyCode = 'INR') {
  const numeric = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const currencyObj =
    CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const hasFraction = Math.abs(Math.round(numeric * 100) % 100) !== 0;

  try {
    return new Intl.NumberFormat(currencyObj.locale, {
      style: 'currency',
      currency: currencyObj.code,
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${currencyObj.symbol}${numeric.toFixed(hasFraction ? 2 : 0)}`;
  }
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function getCategoryMeta(categoryId) {
  return (
    EXPENSE_CATEGORIES.find((cat) => cat.id === categoryId) ||
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}

export function exportExpensesToCsv(expenses, members, groups, currencyCode) {
  const memberMap = new Map(members.map((m) => [m.id, m.name]));
  const groupMap = new Map(groups.map((g) => [g.id, g.name]));

  const headers = [
    'Date',
    'Title',
    'Group',
    'Category',
    'Paid By',
    `Total (${currencyCode})`,
    'Split Mode',
    'Split Breakdown',
  ];

  const rows = expenses.map((exp) => {
    const breakdown = exp.splits
      .map(
        (s) =>
          `${memberMap.get(s.memberId) || s.memberId}: ${Number(s.amount).toFixed(2)}`
      )
      .join(' | ');

    return [
      exp.date,
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      `"${(groupMap.get(exp.groupId) || '').replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      `"${memberMap.get(exp.paidBy) || exp.paidBy}"`,
      Number(exp.amount).toFixed(2),
      exp.splitMode,
      `"${breakdown}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `splitledger-expenses-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
