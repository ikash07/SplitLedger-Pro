import { EXPENSE_CATEGORIES } from '../data/seedData';

export function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Distributes `totalAmount` equally across `memberIds` using .map() and .reduce()
 * while assigning any 0.01 rounding remainder to the initial participants.
 */
export function calculateEqualSplits(totalAmount, memberIds) {
  const total = roundCurrency(totalAmount);
  const count = memberIds.length;
  if (count === 0 || total <= 0) {
    return memberIds.map((memberId) => ({ memberId, amount: 0, percentage: 0 }));
  }

  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainderCents = totalCents - baseCents * count;

  return memberIds.map((memberId, index) => {
    const shareCents = baseCents + (index < remainderCents ? 1 : 0);
    const amount = shareCents / 100;
    const percentage = roundCurrency((amount / total) * 100);
    return { memberId, amount, percentage };
  });
}

/**
 * Computes currency shares from a map of member percentages using .map() and .reduce().
 */
export function calculatePercentageSplits(totalAmount, memberIds, percentagesMap) {
  const total = roundCurrency(totalAmount);
  if (memberIds.length === 0 || total <= 0) {
    return memberIds.map((memberId) => ({
      memberId,
      amount: 0,
      percentage: Number(percentagesMap[memberId] || 0),
    }));
  }

  const rawSplits = memberIds.map((memberId) => {
    const pct = Number(percentagesMap[memberId] || 0);
    return {
      memberId,
      percentage: roundCurrency(pct),
      amount: roundCurrency((total * pct) / 100),
    };
  });

  // Reconcile 0.01 rounding drift when percentages sum to ~100%
  const pctSum = rawSplits.reduce((acc, item) => acc + item.percentage, 0);
  if (Math.abs(pctSum - 100) < 0.05 && rawSplits.length > 0) {
    const allocated = rawSplits.reduce((acc, item) => acc + item.amount, 0);
    const diff = roundCurrency(total - allocated);
    if (Math.abs(diff) > 0 && Math.abs(diff) <= 0.05) {
      const targetIdx = rawSplits.findIndex((s) => s.percentage > 0);
      if (targetIdx >= 0) {
        rawSplits[targetIdx].amount = roundCurrency(
          rawSplits[targetIdx].amount + diff
        );
      }
    }
  }

  return rawSplits;
}

/**
 * Computes comprehensive financial ledger per member using .map(), .filter(), and .reduce().
 * Positive netBalance => Member is owed money (creditor).
 * Negative netBalance => Member owes money (debtor).
 */
export function calculateMemberLedger(members, expenses, settlements = []) {
  return members.map((member) => {
    const totalPaid = expenses
      .filter((exp) => exp.paidBy === member.id)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    const totalShare = expenses.reduce((sum, exp) => {
      const memberSplit = exp.splits.find((s) => s.memberId === member.id);
      return sum + (memberSplit ? Number(memberSplit.amount || 0) : 0);
    }, 0);

    const settledOut = settlements
      .filter((stl) => stl.fromMemberId === member.id)
      .reduce((sum, stl) => sum + Number(stl.amount || 0), 0);

    const settledIn = settlements
      .filter((stl) => stl.toMemberId === member.id)
      .reduce((sum, stl) => sum + Number(stl.amount || 0), 0);

    const netBalance = roundCurrency(
      totalPaid - totalShare + settledOut - settledIn
    );

    return {
      memberId: member.id,
      member,
      totalPaid: roundCurrency(totalPaid),
      totalShare: roundCurrency(totalShare),
      settledOut: roundCurrency(settledOut),
      settledIn: roundCurrency(settledIn),
      netBalance,
    };
  });
}

/**
 * Greedy Minimum-Cash-Flow Debt Simplification Algorithm.
 * Uses .filter(), .map(), and .sort() to minimize total settlement transfers.
 */
export function simplifyDebts(memberLedger) {
  const debtors = memberLedger
    .filter((entry) => entry.netBalance < -0.01)
    .map((entry) => ({
      memberId: entry.memberId,
      member: entry.member,
      remaining: Math.abs(entry.netBalance),
    }))
    .sort((a, b) => b.remaining - a.remaining);

  const creditors = memberLedger
    .filter((entry) => entry.netBalance > 0.01)
    .map((entry) => ({
      memberId: entry.memberId,
      member: entry.member,
      remaining: entry.netBalance,
    }))
    .sort((a, b) => b.remaining - a.remaining);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = roundCurrency(Math.min(debtor.remaining, creditor.remaining));

    if (amount > 0.01) {
      transfers.push({
        id: `${debtor.memberId}-to-${creditor.memberId}`,
        fromId: debtor.memberId,
        fromMember: debtor.member,
        toId: creditor.memberId,
        toMember: creditor.member,
        amount,
      });
    }

    debtor.remaining = roundCurrency(debtor.remaining - amount);
    creditor.remaining = roundCurrency(creditor.remaining - amount);

    if (debtor.remaining <= 0.01) i += 1;
    if (creditor.remaining <= 0.01) j += 1;
  }

  return transfers;
}

/**
 * Counts raw un-simplified IOU edges across expenses using .reduce() and .filter()
 */
export function countRawDebtEdges(expenses) {
  return expenses.reduce((count, exp) => {
    const nonPayerSplits = exp.splits.filter(
      (s) => s.memberId !== exp.paidBy && Number(s.amount) > 0.01
    );
    return count + nonPayerSplits.length;
  }, 0);
}

/**
 * Aggregates spending by category using .reduce(), .map(), and .sort()
 */
export function calculateCategoryBreakdown(expenses) {
  const totalSpend = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const grouped = expenses.reduce((acc, exp) => {
    const key = exp.category || 'Other';
    if (!acc[key]) {
      acc[key] = { amount: 0, count: 0 };
    }
    acc[key].amount = roundCurrency(acc[key].amount + Number(exp.amount || 0));
    acc[key].count += 1;
    return acc;
  }, {});

  return EXPENSE_CATEGORIES.map((cat) => {
    const stats = grouped[cat.id] || { amount: 0, count: 0 };
    return {
      ...cat,
      amount: stats.amount,
      count: stats.count,
      percentage: totalSpend > 0 ? roundCurrency((stats.amount / totalSpend) * 100) : 0,
    };
  })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Filters and sorts expenses dynamically using .filter(), .some(), and .sort()
 */
export function filterAndSortExpenses(expenses, filters = {}) {
  const {
    query = '',
    groupId = 'ALL',
    category = 'ALL',
    paidBy = 'ALL',
    splitMode = 'ALL',
    sortBy = 'date-desc',
  } = filters;

  const normalizedQuery = query.trim().toLowerCase();

  return expenses
    .filter((exp) => {
      if (groupId !== 'ALL' && exp.groupId !== groupId) return false;
      if (category !== 'ALL' && exp.category !== category) return false;
      if (paidBy !== 'ALL' && exp.paidBy !== paidBy) return false;
      if (splitMode !== 'ALL' && exp.splitMode !== splitMode) return false;

      if (normalizedQuery) {
        const matchesTitle = exp.title.toLowerCase().includes(normalizedQuery);
        const matchesNotes = (exp.notes || '')
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesCategory = exp.category
          .toLowerCase()
          .includes(normalizedQuery);
        return matchesTitle || matchesNotes || matchesCategory;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'date-desc':
        default:
          return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
      }
    });
}

/**
 * Checks if every member in a ledger has settled up (using .every())
 */
export function isAllSettled(memberLedger) {
  return memberLedger.every((entry) => Math.abs(entry.netBalance) <= 0.01);
}
