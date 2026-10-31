/**
 * Array Operations Utility Module
 * Explicitly demonstrates array methods:
 * map, filter, reduce, sort, find, some, every
 */

// 1. REDUCE: Calculate total amount spent for a list of expenses
export const calculateTotalSpend = (expenses) => {
  return expenses.reduce((total, exp) => total + (Number(exp.amount) || 0), 0);
};

// 2. REDUCE & MAP: Calculate category spending distribution with percentages
export const getCategoryBreakdown = (expenses, categories) => {
  const total = calculateTotalSpend(expenses);

  // Group and sum amounts by category using reduce
  const categorySums = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'other';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  // Map each category to include sum and percentage of total
  return categories.map(cat => {
    const amount = categorySums[cat.id] || 0;
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    return {
      ...cat,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(percentage * 10) / 10
    };
  }).filter(cat => cat.amount > 0) // filter out unused categories
    .sort((a, b) => b.amount - a.amount); // sort highest spending first
};

// 3. FILTER, FIND, SOME: Filter expenses by multi-criteria search
export const filterExpenses = (expenses, { searchTerm = '', category = 'all', memberId = 'all', groupId = 'all' }) => {
  const term = searchTerm.trim().toLowerCase();

  return expenses.filter(exp => {
    // Check group match
    const matchesGroup = groupId === 'all' || exp.groupId === groupId;

    // Check category match
    const matchesCategory = category === 'all' || exp.category === category;

    // Check member involvement (paidBy OR in splits using .some())
    const matchesMember = memberId === 'all' || 
      exp.paidBy === memberId || 
      (Array.isArray(exp.splits) && exp.splits.some(s => s.memberId === memberId));

    // Check search term against title or notes
    const matchesSearch = !term || 
      exp.title.toLowerCase().includes(term) || 
      (exp.notes && exp.notes.toLowerCase().includes(term));

    return matchesGroup && matchesCategory && matchesMember && matchesSearch;
  });
};

// 4. SORT: Sort expenses dynamically
export const sortExpenses = (expenses, sortKey = 'date-desc') => {
  const list = [...expenses];
  return list.sort((a, b) => {
    switch (sortKey) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount-desc':
        return Number(b.amount) - Number(a.amount);
      case 'amount-asc':
        return Number(a.amount) - Number(b.amount);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

// 5. FIND: Find item in collection
export const findItemById = (items, id) => {
  return items.find(item => item.id === id);
};

// 6. EVERY & SOME: Validate expense splits against total
export const validateSplitAllocations = (splits, totalAmount, splitType) => {
  if (!Array.isArray(splits) || splits.length === 0) {
    return { isValid: false, message: 'At least one member must be included.' };
  }

  // Validate non-negative allocations using every()
  const allPositive = splits.every(s => (Number(s.amount) || 0) >= 0);
  if (!allPositive) {
    return { isValid: false, message: 'All split amounts must be zero or positive.' };
  }

  if (splitType === 'EXACT') {
    const sum = splits.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    const diff = Math.abs(sum - totalAmount);
    if (diff > 0.05) {
      return { 
        isValid: false, 
        message: `Sum of exact splits (${sum.toFixed(2)}) must equal total (${totalAmount.toFixed(2)}). Diff: ${diff.toFixed(2)}` 
      };
    }
  }

  if (splitType === 'PERCENTAGE') {
    const totalPercent = splits.reduce((acc, s) => acc + (Number(s.percentage) || 0), 0);
    if (Math.abs(totalPercent - 100) > 0.1) {
      return { 
        isValid: false, 
        message: `Total percentage must equal 100% (currently ${totalPercent.toFixed(1)}%)` 
      };
    }
  }

  if (splitType === 'SHARES') {
    const totalShares = splits.reduce((acc, s) => acc + (Number(s.shares) || 0), 0);
    if (totalShares <= 0) {
      return { isValid: false, message: 'Total shares must be greater than zero.' };
    }
  }

  return { isValid: true, message: 'Valid allocation' };
};
