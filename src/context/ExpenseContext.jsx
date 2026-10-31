import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  INITIAL_MEMBERS, 
  INITIAL_GROUPS, 
  INITIAL_EXPENSES, 
  INITIAL_ACTIVITIES,
  CATEGORIES 
} from '../data/initialData';
import { calculateNetBalances, simplifyDebts } from '../utils/debtSimplifier';
import { calculateTotalSpend, getCategoryBreakdown } from '../utils/arrayHelpers';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  // Persistent state using custom hook useLocalStorage
  const [members, setMembers] = useLocalStorage('splitmate_members', INITIAL_MEMBERS);
  const [groups, setGroups] = useLocalStorage('splitmate_groups', INITIAL_GROUPS);
  const [expenses, setExpenses] = useLocalStorage('splitmate_expenses', INITIAL_EXPENSES);
  const [activities, setActivities] = useLocalStorage('splitmate_activities', INITIAL_ACTIVITIES);
  const [activeGroupId, setActiveGroupId] = useLocalStorage('splitmate_active_group', 'grp-1');
  const [currentUserId] = useLocalStorage('splitmate_user_id', 'm1');

  // Lookups using array operations
  const membersMap = useMemo(() => {
    return members.reduce((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {});
  }, [members]);

  const currentUser = useMemo(() => {
    return members.find(m => m.id === currentUserId) || members[0];
  }, [members, currentUserId]);

  const activeGroup = useMemo(() => {
    if (activeGroupId === 'all') return null;
    return groups.find(g => g.id === activeGroupId) || null;
  }, [groups, activeGroupId]);

  // Expenses scoped to active group or all
  const scopedExpenses = useMemo(() => {
    if (activeGroupId === 'all') return expenses;
    return expenses.filter(exp => exp.groupId === activeGroupId);
  }, [expenses, activeGroupId]);

  // Members scoped to active group or all
  const scopedMembers = useMemo(() => {
    if (!activeGroup) return members;
    return members.filter(m => activeGroup.members.includes(m.id));
  }, [members, activeGroup]);

  // Compute Net Balances using array reduce
  const netBalances = useMemo(() => {
    return calculateNetBalances(scopedMembers, scopedExpenses);
  }, [scopedMembers, scopedExpenses]);

  // Compute Simplified Debts using greedy algorithm
  const simplifiedDebts = useMemo(() => {
    return simplifyDebts(netBalances, membersMap);
  }, [netBalances, membersMap]);

  // Financial aggregates for current user
  const currentUserNet = useMemo(() => {
    return netBalances[currentUserId] || 0;
  }, [netBalances, currentUserId]);

  const { currentUserOwed, currentUserOwes } = useMemo(() => {
    let owed = 0;
    let owes = 0;
    simplifiedDebts.forEach(debt => {
      if (debt.toMemberId === currentUserId) {
        owed += debt.amount;
      }
      if (debt.fromMemberId === currentUserId) {
        owes += debt.amount;
      }
    });
    return { 
      currentUserOwed: Math.round(owed * 100) / 100, 
      currentUserOwes: Math.round(owes * 100) / 100 
    };
  }, [simplifiedDebts, currentUserId]);

  const totalSpend = useMemo(() => {
    return calculateTotalSpend(scopedExpenses);
  }, [scopedExpenses]);

  const categoryBreakdown = useMemo(() => {
    return getCategoryBreakdown(scopedExpenses, CATEGORIES);
  }, [scopedExpenses]);

  // Actions
  const addExpense = useCallback((newExpense) => {
    const id = `exp-${Date.now()}`;
    const expenseWithId = { ...newExpense, id };

    setExpenses(prev => [expenseWithId, ...prev]);

    // Add activity record
    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'EXPENSE_ADDED',
      title: expenseWithId.title,
      amount: expenseWithId.amount,
      actorId: expenseWithId.paidBy,
      groupId: expenseWithId.groupId,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);

    return expenseWithId;
  }, [setExpenses, setActivities]);

  const deleteExpense = useCallback((expenseId) => {
    const deletedExp = expenses.find(e => e.id === expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));

    if (deletedExp) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'EXPENSE_DELETED',
          title: `Removed: ${deletedExp.title}`,
          amount: deletedExp.amount,
          actorId: currentUserId,
          groupId: deletedExp.groupId,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  }, [expenses, currentUserId, setExpenses, setActivities]);

  const addGroup = useCallback((groupData) => {
    const newGroup = {
      ...groupData,
      id: `grp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      members: groupData.members || [currentUserId]
    };
    setGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    return newGroup;
  }, [currentUserId, setGroups, setActiveGroupId]);

  const addMember = useCallback((memberData) => {
    const colors = ['#6366F1', '#EC4899', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#14B8A6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newMember = {
      id: `m-${Date.now()}`,
      name: memberData.name,
      email: memberData.email || `${memberData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatarColor: randomColor
    };

    setMembers(prev => [...prev, newMember]);

    if (memberData.groupId) {
      setGroups(prev => prev.map(g => {
        if (g.id === memberData.groupId && !g.members.includes(newMember.id)) {
          return { ...g, members: [...g.members, newMember.id] };
        }
        return g;
      }));
    }

    return newMember;
  }, [setMembers, setGroups]);

  const settleDebt = useCallback((fromMemberId, toMemberId, amount, note = 'Debt settled') => {
    // Record settlement as a balancing expense or settlement activity
    const settlementId = `exp-settle-${Date.now()}`;
    const settlementExpense = {
      id: settlementId,
      groupId: activeGroupId !== 'all' ? activeGroupId : groups[0]?.id || 'grp-1',
      title: `Settlement: ${membersMap[fromMemberId]?.name || 'Member'} paid ${membersMap[toMemberId]?.name || 'Member'}`,
      amount: Number(amount),
      paidBy: fromMemberId,
      splitType: 'EXACT',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      notes: note,
      isSettlement: true,
      splits: [
        { memberId: toMemberId, amount: Number(amount), percentage: 100 }
      ]
    };

    setExpenses(prev => [settlementExpense, ...prev]);

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'SETTLEMENT',
        title: `Settled payment of $${amount}`,
        amount: Number(amount),
        fromMemberId,
        toMemberId,
        groupId: settlementExpense.groupId,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  }, [activeGroupId, groups, membersMap, setExpenses, setActivities]);

  const resetToSampleData = useCallback(() => {
    setMembers(INITIAL_MEMBERS);
    setGroups(INITIAL_GROUPS);
    setExpenses(INITIAL_EXPENSES);
    setActivities(INITIAL_ACTIVITIES);
    setActiveGroupId('grp-1');
  }, [setMembers, setGroups, setExpenses, setActivities, setActiveGroupId]);

  const value = {
    members,
    groups,
    expenses,
    scopedExpenses,
    activities,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    scopedMembers,
    currentUserId,
    currentUser,
    membersMap,
    categories: CATEGORIES,
    netBalances,
    simplifiedDebts,
    currentUserNet,
    currentUserOwed,
    currentUserOwes,
    totalSpend,
    categoryBreakdown,
    addExpense,
    deleteExpense,
    addGroup,
    addMember,
    settleDebt,
    resetToSampleData
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
