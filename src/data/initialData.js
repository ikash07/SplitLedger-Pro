// Initial sample data for realistic demonstration
export const INITIAL_MEMBERS = [
  { id: 'm1', name: 'You (Joy)', email: 'joy@example.com', avatarColor: '#6366F1', isCurrentUser: true },
  { id: 'm2', name: 'Priya Sharma', email: 'priya.s@example.com', avatarColor: '#EC4899' },
  { id: 'm3', name: 'Rohan Verma', email: 'rohan.v@example.com', avatarColor: '#10B981' },
  { id: 'm4', name: 'Alex Chen', email: 'alex.chen@example.com', avatarColor: '#06B6D4' },
  { id: 'm5', name: 'Samantha Miller', email: 'sam.miller@example.com', avatarColor: '#F59E0B' }
];

export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'travel', label: 'Travel & Transit', icon: 'Plane', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'accommodation', label: 'Accommodation', icon: 'Home', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  { id: 'groceries', label: 'Groceries', icon: 'ShoppingCart', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Film', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: 'utilities', label: 'Utilities & Bills', icon: 'Zap', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: '#64748B', bg: 'rgba(100, 116, 139, 0.15)' }
];

export const INITIAL_GROUPS = [
  {
    id: 'grp-1',
    name: 'Goa Vacation Trip 🌴',
    description: '4-day beach getaway with flights, beachfront stay & dinners',
    currency: '$',
    category: 'travel',
    createdAt: '2026-10-15',
    members: ['m1', 'm2', 'm3', 'm4']
  },
  {
    id: 'grp-2',
    name: 'Apartment 402 Roommates 🏠',
    description: 'Monthly flat rent, groceries, high-speed Wi-Fi, and cleaner bills',
    currency: '$',
    category: 'accommodation',
    createdAt: '2026-09-01',
    members: ['m1', 'm2', 'm5']
  },
  {
    id: 'grp-3',
    name: 'Weekend Foodies Club 🍕',
    description: 'Weekly team dinners, brunch outings and pizza nights',
    currency: '$',
    category: 'food',
    createdAt: '2026-10-01',
    members: ['m1', 'm3', 'm4', 'm5']
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    groupId: 'grp-1',
    title: 'Seaside Villa 3-Night Stay',
    amount: 720.00,
    paidBy: 'm1', // Joy paid
    splitType: 'EQUAL', // Equal among m1, m2, m3, m4
    date: '2026-10-24',
    category: 'accommodation',
    notes: 'Booked directly via seaside host. Includes pool & breakfast.',
    splits: [
      { memberId: 'm1', amount: 180.00, percentage: 25 },
      { memberId: 'm2', amount: 180.00, percentage: 25 },
      { memberId: 'm3', amount: 180.00, percentage: 25 },
      { memberId: 'm4', amount: 180.00, percentage: 25 }
    ]
  },
  {
    id: 'exp-2',
    groupId: 'grp-1',
    title: 'Candlelight Seafood Dinner at Fisherman’s Wharf',
    amount: 240.00,
    paidBy: 'm2', // Priya paid
    splitType: 'EXACT',
    date: '2026-10-25',
    category: 'food',
    notes: 'Lobster platter and wine. Alex and Priya ordered specials.',
    splits: [
      { memberId: 'm1', amount: 50.00, percentage: 20.83 },
      { memberId: 'm2', amount: 80.00, percentage: 33.33 },
      { memberId: 'm3', amount: 50.00, percentage: 20.83 },
      { memberId: 'm4', amount: 60.00, percentage: 25.01 }
    ]
  },
  {
    id: 'exp-3',
    groupId: 'grp-1',
    title: 'Self-Drive SUV Rental & Fuel',
    amount: 160.00,
    paidBy: 'm3', // Rohan paid
    splitType: 'EQUAL',
    date: '2026-10-26',
    category: 'travel',
    notes: 'Scorpio rental + diesel full tank',
    splits: [
      { memberId: 'm1', amount: 40.00, percentage: 25 },
      { memberId: 'm2', amount: 40.00, percentage: 25 },
      { memberId: 'm3', amount: 40.00, percentage: 25 },
      { memberId: 'm4', amount: 40.00, percentage: 25 }
    ]
  },
  {
    id: 'exp-4',
    groupId: 'grp-2',
    title: 'Whole Foods Monthly Organic Groceries',
    amount: 285.50,
    paidBy: 'm1', // Joy paid
    splitType: 'PERCENTAGE',
    date: '2026-10-27',
    category: 'groceries',
    notes: 'Pantry staples, almond milk, veggies, coffee beans',
    splits: [
      { memberId: 'm1', amount: 114.20, percentage: 40 },
      { memberId: 'm2', amount: 85.65, percentage: 30 },
      { memberId: 'm5', amount: 85.65, percentage: 30 }
    ]
  },
  {
    id: 'exp-5',
    groupId: 'grp-2',
    title: 'Gigabit Fiber Internet & Streaming',
    amount: 90.00,
    paidBy: 'm5', // Sam paid
    splitType: 'EQUAL',
    date: '2026-10-28',
    category: 'utilities',
    notes: 'Monthly 1Gbps internet + Netflix & Prime bundle',
    splits: [
      { memberId: 'm1', amount: 30.00, percentage: 33.33 },
      { memberId: 'm2', amount: 30.00, percentage: 33.33 },
      { memberId: 'm5', amount: 30.00, percentage: 33.34 }
    ]
  },
  {
    id: 'exp-6',
    groupId: 'grp-3',
    title: 'Artisan Woodfire Pizza & Craft Beers',
    amount: 175.00,
    paidBy: 'm4', // Alex paid
    splitType: 'SHARES',
    date: '2026-10-29',
    category: 'food',
    notes: 'Truffle mushroom pizza, pepperoni, IPA pints',
    splits: [
      { memberId: 'm1', amount: 50.00, shares: 2 },
      { memberId: 'm3', amount: 50.00, shares: 2 },
      { memberId: 'm4', amount: 50.00, shares: 2 },
      { memberId: 'm5', amount: 25.00, shares: 1 }
    ]
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'EXPENSE_ADDED',
    title: 'Artisan Woodfire Pizza & Craft Beers',
    amount: 175.00,
    actorId: 'm4',
    groupId: 'grp-3',
    timestamp: '2026-10-29T20:30:00Z'
  },
  {
    id: 'act-2',
    type: 'EXPENSE_ADDED',
    title: 'Gigabit Fiber Internet & Streaming',
    amount: 90.00,
    actorId: 'm5',
    groupId: 'grp-2',
    timestamp: '2026-10-28T14:15:00Z'
  },
  {
    id: 'act-3',
    type: 'EXPENSE_ADDED',
    title: 'Whole Foods Monthly Organic Groceries',
    amount: 285.50,
    actorId: 'm1',
    groupId: 'grp-2',
    timestamp: '2026-10-27T11:00:00Z'
  },
  {
    id: 'act-4',
    type: 'SETTLEMENT',
    title: 'Settled bill payment',
    amount: 45.00,
    fromMemberId: 'm3',
    toMemberId: 'm1',
    groupId: 'grp-1',
    timestamp: '2026-10-26T18:00:00Z'
  }
];
