/**
 * Greedy Debt Simplification Algorithm
 * Demonstrates advanced JS array operations: reduce, map, filter, sort
 * Minimizes total number of transactions between members
 */
export const calculateNetBalances = (members, expenses) => {
  // Initialize balance sheet with 0 for all members
  const balances = members.reduce((acc, member) => {
    acc[member.id] = 0;
    return acc;
  }, {});

  // Iterate over each expense
  expenses.forEach(exp => {
    const paidBy = exp.paidBy;
    const totalAmount = Number(exp.amount) || 0;

    // Credit the payer with the total amount paid
    if (balances[paidBy] !== undefined) {
      balances[paidBy] += totalAmount;
    }

    // Debit each participant for their split share
    if (Array.isArray(exp.splits)) {
      exp.splits.forEach(split => {
        if (balances[split.memberId] !== undefined) {
          balances[split.memberId] -= Number(split.amount) || 0;
        }
      });
    }
  });

  return balances;
};

export const simplifyDebts = (balances, membersMap = {}) => {
  // Extract creditors (owed money, net > 0) and debtors (owe money, net < 0)
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([memberId, net]) => {
    // Round to 2 decimal places to avoid floating point precision issues
    const rounded = Math.round(net * 100) / 100;
    if (rounded > 0.01) {
      creditors.push({ memberId, amount: rounded });
    } else if (rounded < -0.01) {
      debtors.push({ memberId, amount: Math.abs(rounded) });
    }
  });

  // Sort descending by amount to settle largest debts first (Greedy approach)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  let i = 0; // index for debtors
  let j = 0; // index for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(settledAmount * 100) / 100;

    if (roundedAmount > 0) {
      transactions.push({
        id: `tx-${debtor.memberId}-${creditor.memberId}-${Date.now()}-${transactions.length}`,
        fromMemberId: debtor.memberId,
        fromMember: membersMap[debtor.memberId] || { name: debtor.memberId },
        toMemberId: creditor.memberId,
        toMember: membersMap[creditor.memberId] || { name: creditor.memberId },
        amount: roundedAmount
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return transactions;
};
