# 💸 SplitMate - Shared Expense & Bill Splitter

A production-grade, responsive **Shared Expense Splitter** built with **React JS**, demonstrating modern component-based architecture, advanced React hooks, dynamic JavaScript array methods, multi-route client navigation, and multiple styling paradigms.

---

## 🌟 Key Features

1. **Multi-Group & Trip Management**
   - Create and organize expenses across different groups (e.g., *Goa Vacation Trip*, *Apartment 402 Roommates*, *Weekend Foodies Club*).
   - Dynamic group switching with instant recalculation of group spend and member balances.

2. **Smart 4-Way Expense Split Calculator**
   - **Equal Split**: Automatically divides bills equally among selected group members.
   - **Exact Amounts Split**: Enter exact dollar amounts per person with auto-balancing validation.
   - **Percentage Split**: Allocate custom percentages with real-time validation to ensure total equals 100%.
   - **Shares / Units Split**: Assign weight shares (e.g., 2 shares vs 1 share) with automatic ratio calculation.
   - **Live Allocation Visualizer**: Dynamic visual distribution bar showing who pays what share.

3. **Greedy Debt Simplification Algorithm**
   - Minimizes the total number of cross-member transactions to the theoretical minimum.
   - Solves circular debts (e.g., turning 10 messy inter-member debts into just 2 direct settlements).

4. **Balances & One-Click "Settle Up"**
   - Detailed **Member Balance Ledger** detailing Total Paid Upfront, Total Share Consumed, and Net Balance.
   - Interactive settlement modal with celebratory confetti animation (`canvas-confetti`).

5. **Deep Analytics & Audit Activity Trail**
   - Category spending breakdown with dynamic progress meters.
   - Member out-of-pocket contribution comparisons.
   - Chronological audit log of all expense additions, updates, and settlements.
   - Export expenses to **CSV** format.

---

## 🚀 Academic & Technical Demonstrations

### 1. Component-Based Architecture
- Modular component hierarchy organized by responsibility:
  - `src/components/common/`: Generic, reusable UI building blocks (`Button`, `Card`, `Modal`, `Avatar`, `Badge`, `StatCard`, `SearchFilterBar`).
  - `src/components/layout/`: Responsive `Navbar` and `Footer`.
  - `src/components/expenses/`: `ExpenseCard`, `ExpenseDetailsModal`.
  - `src/components/settlements/`: `DebtCard`, `BalanceMatrix`, `SettleModal`.
  - `src/components/analytics/`: `CategoryBreakdown`, `SpendingTrends`.
  - `src/pages/`: Page-level route views (`Dashboard`, `ExpensesPage`, `AddExpensePage`, `SettlementsPage`, `GroupsPage`, `AnalyticsPage`, `ActivityPage`).

### 2. JSX Syntax & Conditional Rendering
- Semantic JSX structure with fragment wrappers (`<>...</>`).
- Conditional rendering patterns: short-circuit `&&`, ternary operators `condition ? <A /> : <B />`, and empty states.

### 3. Props & State Management with Hooks
- **`useState`**: Local component state (split modes, input fields, modal open/close states, active filters).
- **`useEffect`**: Document title updates, escape key listeners for modal accessibility, and state synchronization.
- **`useMemo`**: Heavy calculations cached to prevent unnecessary re-computations (net balances, simplified debts, filtered expense lists, category aggregates).
- **`useCallback`**: Memoized event handlers (`addExpense`, `deleteExpense`, `settleDebt`, `addGroup`).
- **`useLocalStorage`**: Custom hook providing reactive `localStorage` persistence and multi-tab synchronization.
- **`useExpenses`**: Central custom React Context hook exposing shared state and business logic.

### 4. Dynamic Rendering using JavaScript Array Operations
- **`map`**: Dynamic rendering of expense cards, member lists, split input rows, category progress bars, and activity timelines.
- **`filter`**: Real-time search by title, category filtering, member involvement, and active group scoping.
- **`reduce`**: Aggregating total group spend, computing net balance ledger matrices, and grouping expenses by category.
- **`sort`**: Multi-criteria sorting (newest/oldest, highest/lowest amount, alphabetical title).
- **`find`**: Looking up specific members, groups, and expense records by ID.
- **`some`**: Checking whether a member participated in an expense or if any input is invalid.
- **`every`**: Validating that all split shares are non-negative and total exactly 100% or equal the bill total.

### 5. Multiple Styling Approaches Demonstrated
- **Vanilla CSS Design System (`src/index.css`)**:
  - CSS Custom Properties (`--bg-primary`, `--primary`, `--success`, `--danger`, etc.)
  - Glassmorphic panels with backdrop filter blur
  - Typography with Google Fonts ('Outfit' and 'Plus Jakarta Sans')
  - Responsive media queries and utility classes
- **CSS Modules**:
  - `Modal.module.css`: Scoped overlay, dialog animations, and close button states
  - `Navbar.module.css`: Scoped header layout, active route highlights, and dropdown styling
  - `ExpenseCard.module.css`: Scoped card layout, metadata alignment, and hover transformations
- **Dynamic Inline Styles (`style={{ ... }}`)**:
  - Avatar background gradients computed dynamically from member initials and colors
  - Progress bar widths computed dynamically (`width: ${percentage}%`)
  - Status color indicators based on positive/negative balance values

### 6. Routing with React Router (v7)
- `BrowserRouter`, `Routes`, and `Route` configuration in [App.jsx](src/App.jsx):
  - `/` → **Dashboard**: Financial stats, recent expenses, simplified debts
  - `/expenses` → **Expenses**: Filterable, searchable, sortable list with CSV export
  - `/add-expense` → **Split Calculator**: 4-mode split allocator
  - `/settle` → **Balances & Settlements**: Debt minimization and settlement modal
  - `/groups` → **Groups & Members**: Group cards, creation modal, member management
  - `/analytics` → **Analytics & Reports**: Visual breakdown charts
  - `/activity` → **Activity Trail**: Chronological audit feed
- `NavLink` with dynamic active styling.

---

## 💻 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
