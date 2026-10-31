import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_GROUPS,
  INITIAL_EXPENSES,
  INITIAL_SETTLEMENTS,
} from '../data/seedData';
import {
  calculateMemberLedger,
  simplifyDebts,
  roundCurrency,
  isAllSettled,
} from '../utils/expenseCalculations';

const STORAGE_KEY = 'splitledger_state_v1';

const MEMBER_PALETTE = [
  '#0f766e',
  '#2563eb',
  '#db2777',
  '#d97706',
  '#7c3aed',
  '#059669',
  '#dc2626',
  '#4f46e5',
];

const ExpenseContext = createContext(null);

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.members) &&
        Array.isArray(parsed.groups) &&
        Array.isArray(parsed.expenses)
      ) {
        return {
          members: parsed.members,
          groups: parsed.groups,
          expenses: parsed.expenses,
          settlements: Array.isArray(parsed.settlements) ? parsed.settlements : [],
          activeUserId: parsed.activeUserId || parsed.members[0]?.id || 'aarav',
          currency: parsed.currency || 'INR',
        };
      }
    }
  } catch (err) {
    console.warn('Could not read saved state from localStorage:', err);
  }

  return {
    members: INITIAL_MEMBERS,
    groups: INITIAL_GROUPS,
    expenses: INITIAL_EXPENSES,
    settlements: INITIAL_SETTLEMENTS,
    activeUserId: 'aarav',
    currency: 'INR',
  };
}

export function ExpenseProvider({ children }) {
  const initial = useMemo(() => loadInitialState(), []);

  const [members, setMembers] = useState(initial.members);
  const [groups, setGroups] = useState(initial.groups);
  const [expenses, setExpenses] = useState(initial.expenses);
  const [settlements, setSettlements] = useState(initial.settlements);
  const [activeUserId, setActiveUserId] = useState(initial.activeUserId);
  const [currency, setCurrency] = useState(initial.currency);

  // Global modal & toast feedback state
  const [expenseModalState, setExpenseModalState] = useState({
    isOpen: false,
    defaultGroupId: '',
    editingExpense: null,
  });
  const [toast, setToast] = useState(null);

  // Persist ledger state to localStorage whenever core data changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        members,
        groups,
        expenses,
        settlements,
        activeUserId,
        currency,
      });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      console.warn('Could not save state to localStorage:', err);
    }
  }, [members, groups, expenses, settlements, activeUserId, currency]);

  // Auto-dismiss toast notifications
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const activeUser = useMemo(
    () => members.find((m) => m.id === activeUserId) || members[0],
    [members, activeUserId]
  );

  // Overall member balances & simplified settlements
  const overallLedger = useMemo(
    () => calculateMemberLedger(members, expenses, settlements),
    [members, expenses, settlements]
  );

  const overallTransfers = useMemo(
    () => simplifyDebts(overallLedger),
    [overallLedger]
  );

  // Per-group enriched summaries computed with .map() and .filter()
  const groupSummaries = useMemo(() => {
    return groups.map((group) => {
      const groupMembers = members.filter((m) => group.memberIds.includes(m.id));
      const groupExpenses = expenses.filter((e) => e.groupId === group.id);
      const groupSettlements = settlements.filter((s) => s.groupId === group.id);

      const totalSpend = roundCurrency(
        groupExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
      );

      const ledger = calculateMemberLedger(
        groupMembers,
        groupExpenses,
        groupSettlements
      );
      const transfers = simplifyDebts(ledger);
      const activeEntry = ledger.find((l) => l.memberId === activeUser?.id);

      return {
        ...group,
        members: groupMembers,
        expenses: groupExpenses,
        settlements: groupSettlements,
        expenseCount: groupExpenses.length,
        totalSpend,
        ledger,
        transfers,
        allSettled: isAllSettled(ledger),
        activeUserNet: activeEntry ? activeEntry.netBalance : 0,
      };
    });
  }, [groups, members, expenses, settlements, activeUser]);

  // Active user KPI metrics across all groups
  const activeUserSummary = useMemo(() => {
    const entry = overallLedger.find((item) => item.memberId === activeUser?.id);
    const totalGroupSpend = roundCurrency(
      expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    );

    // Sum per-group positive vs negative positions for clearer real-world breakdown
    const owedToYou = roundCurrency(
      groupSummaries
        .filter((g) => g.activeUserNet > 0.01)
        .reduce((sum, g) => sum + g.activeUserNet, 0)
    );
    const youOwe = roundCurrency(
      groupSummaries
        .filter((g) => g.activeUserNet < -0.01)
        .reduce((sum, g) => sum + Math.abs(g.activeUserNet), 0)
    );

    return {
      totalGroupSpend,
      totalPaid: entry?.totalPaid || 0,
      totalShare: entry?.totalShare || 0,
      netBalance: entry?.netBalance || 0,
      owedToYou,
      youOwe,
    };
  }, [overallLedger, expenses, groupSummaries, activeUser]);

  // CRUD Handlers
  const addExpense = useCallback(
    (expenseInput) => {
      const newExpense = {
        ...expenseInput,
        id: `exp-${Date.now()}`,
        amount: roundCurrency(expenseInput.amount),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      showToast(`Added "${newExpense.title}" to ledger`);
      return newExpense;
    },
    [showToast]
  );

  const updateExpense = useCallback(
    (expenseId, updatedFields) => {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId
            ? {
                ...exp,
                ...updatedFields,
                id: expenseId,
                amount: roundCurrency(updatedFields.amount),
              }
            : exp
        )
      );
      showToast(`Updated "${updatedFields.title}"`);
    },
    [showToast]
  );

  const deleteExpense = useCallback(
    (expenseId) => {
      const target = expenses.find((e) => e.id === expenseId);
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
      showToast(
        target ? `Removed "${target.title}"` : 'Expense deleted',
        'neutral'
      );
    },
    [expenses, showToast]
  );

  const createMemberRecord = useCallback(
    ({ name, email = '', handle = '' }) => {
      const cleanName = name.trim();
      const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueId = `${slug || 'member'}-${Date.now().toString().slice(-4)}`;
      const color = MEMBER_PALETTE[members.length % MEMBER_PALETTE.length];

      const newMember = {
        id: uniqueId,
        name: cleanName,
        email: email.trim() || `${slug || 'user'}@example.com`,
        handle: handle.trim() || `${slug || 'user'}@upi`,
        color,
      };
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    },
    [members.length]
  );

  const addGroup = useCallback(
    ({ name, type, description, memberIds, newMemberNames = [] }) => {
      const createdMembers = newMemberNames
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n, idx) => {
          const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return {
            id: `${slug || 'member'}-${Date.now()}-${idx}`,
            name: n,
            email: `${slug || 'member'}@example.com`,
            handle: `${slug || 'member'}@upi`,
            color:
              MEMBER_PALETTE[(members.length + idx) % MEMBER_PALETTE.length],
          };
        });

      if (createdMembers.length > 0) {
        setMembers((prev) => [...prev, ...createdMembers]);
      }

      const finalMemberIds = Array.from(
        new Set([...memberIds, ...createdMembers.map((m) => m.id)])
      );

      const newGroup = {
        id: `grp-${Date.now()}`,
        name: name.trim(),
        type: type || 'Trip',
        description: description.trim(),
        memberIds: finalMemberIds,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setGroups((prev) => [newGroup, ...prev]);
      showToast(`Created group "${newGroup.name}"`);
      return newGroup;
    },
    [members.length, showToast]
  );

  const addMemberToGroup = useCallback(
    (groupId, { existingMemberId, newName, newHandle }) => {
      let memberIdToAdd = existingMemberId;
      let labelName = '';

      if (!memberIdToAdd && newName?.trim()) {
        const created = createMemberRecord({
          name: newName,
          handle: newHandle,
        });
        memberIdToAdd = created.id;
        labelName = created.name;
      } else {
        const found = members.find((m) => m.id === memberIdToAdd);
        labelName = found?.name || 'Member';
      }

      if (!memberIdToAdd) return null;

      setGroups((prev) =>
        prev.map((grp) =>
          grp.id === groupId && !grp.memberIds.includes(memberIdToAdd)
            ? { ...grp, memberIds: [...grp.memberIds, memberIdToAdd] }
            : grp
        )
      );
      showToast(`Added ${labelName} to group`);
      return memberIdToAdd;
    },
    [createMemberRecord, members, showToast]
  );

  const recordSettlement = useCallback(
    ({ groupId, fromMemberId, toMemberId, amount, method = 'UPI', note = '' }) => {
      const newSettlement = {
        id: `stl-${Date.now()}`,
        groupId: groupId || groups[0]?.id || 'general',
        fromMemberId,
        toMemberId,
        amount: roundCurrency(amount),
        method,
        date: new Date().toISOString().slice(0, 10),
        note: note.trim(),
      };
      setSettlements((prev) => [newSettlement, ...prev]);
      showToast('Settlement payment recorded');
      return newSettlement;
    },
    [groups, showToast]
  );

  const deleteSettlement = useCallback(
    (settlementId) => {
      setSettlements((prev) => prev.filter((s) => s.id !== settlementId));
      showToast('Settlement record removed', 'neutral');
    },
    [showToast]
  );

  const resetDemoData = useCallback(() => {
    setMembers(INITIAL_MEMBERS);
    setGroups(INITIAL_GROUPS);
    setExpenses(INITIAL_EXPENSES);
    setSettlements(INITIAL_SETTLEMENTS);
    setActiveUserId('aarav');
    setCurrency('INR');
    window.localStorage.removeItem(STORAGE_KEY);
    showToast('Restored default demo dataset');
  }, [showToast]);

  const openExpenseModal = useCallback(
    ({ defaultGroupId = '', editingExpense = null } = {}) => {
      setExpenseModalState({
        isOpen: true,
        defaultGroupId: defaultGroupId || groups[0]?.id || '',
        editingExpense,
      });
    },
    [groups]
  );

  const closeExpenseModal = useCallback(() => {
    setExpenseModalState({
      isOpen: false,
      defaultGroupId: '',
      editingExpense: null,
    });
  }, []);

  const value = useMemo(
    () => ({
      members,
      groups,
      expenses,
      settlements,
      activeUserId,
      setActiveUserId,
      activeUser,
      currency,
      setCurrency,
      overallLedger,
      overallTransfers,
      groupSummaries,
      activeUserSummary,
      addExpense,
      updateExpense,
      deleteExpense,
      addGroup,
      addMemberToGroup,
      recordSettlement,
      deleteSettlement,
      resetDemoData,
      expenseModalState,
      openExpenseModal,
      closeExpenseModal,
      toast,
      dismissToast: () => setToast(null),
    }),
    [
      members,
      groups,
      expenses,
      settlements,
      activeUserId,
      activeUser,
      currency,
      overallLedger,
      overallTransfers,
      groupSummaries,
      activeUserSummary,
      addExpense,
      updateExpense,
      deleteExpense,
      addGroup,
      addMemberToGroup,
      recordSettlement,
      deleteSettlement,
      resetDemoData,
      expenseModalState,
      openExpenseModal,
      closeExpenseModal,
      toast,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error('useExpenses must be used inside <ExpenseProvider>');
  }
  return ctx;
}
