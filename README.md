# SplitLedger — Shared Expense Splitter (React JS)

A responsive, real-world shared expense tracking and settlement application built with **React 18**, **React Router v6**, **React Hooks**, and **four distinct styling methodologies**.

---

## Core Features

- **Multi-Group Expense Workspaces**: Organize shared budgets across trips, shared flats, dinners, and events, with dynamic member management.
- **Three Precision Split Modes**:
  1. **Equal Split** — Automatically divides bills equally and reconciles `0.01` rounding remainders so split sums always match the bill total.
  2. **Exact Amounts** — Itemized per-member currency allocation with live remaining/over-allocated validation.
  3. **Percentage Split (`%`)** — Proportional shares with a live `100%` allocation meter and real-time currency conversion.
- **Minimum-Cash-Flow Debt Simplification**: Uses a greedy creditor-debtor matching algorithm to compress circular IOUs into the minimum number of repayment transfers.
- **Perspective & Multi-Currency Switcher**: Switch active member perspective (*"Viewing as"*) in the top bar to inspect personalized *"Owed to you"* vs. *"You owe"* metrics in `₹ INR`, `$ USD`, `€ EUR`, or `£ GBP`.
- **Searchable, URL-Synced Ledger & CSV Export**: Filter by search query, group, category, payer, or split mode with URL query parameter synchronization (`useSearchParams`) and one-click CSV export.
- **Persistent Local Storage**: Automatically saves groups, expenses, and settlements to `localStorage` with a one-click **Reset Demo Dataset** option.

---

## Mapping of Technical Concepts to Codebase

| Requirement | Implementation Details | Key Files |
| :--- | :--- | :--- |
| **1. Component-Based Architecture** | Modular separation into layout shells, route pages, domain feature modals/cards, and atomic UI primitives. | `src/components/layout/`, `src/pages/`, `src/components/expenses/`, `src/components/ui/` |
| **2. JSX Syntax** | Declarative UI composition, conditional rendering (`? :`, `&&`), fragments (`<>...</>`), dynamic SVG donut segments, and accessible form bindings. | `src/pages/AnalyticsPage.jsx`, `src/components/expenses/ExpenseItem.jsx` |
| **3. Props & State Management with Hooks** | Uses `useState`, `useEffect` (`localStorage` sync, `Escape` listener, toast timers), `useMemo` (derived ledgers & category totals), `useCallback`, `useRef` (input auto-focus), and `createContext` / `useContext` (`useExpenses` custom hook). | `src/context/ExpenseContext.jsx`, `src/components/expenses/AddExpenseModal.jsx`, `src/components/ui/Modal.jsx` |
| **4. Dynamic Rendering via JS Array Operations** | Extensive use of `.map()`, `.filter()`, `.reduce()`, `.sort()`, `.find()`, `.every()`, and `.flatMap()` for ledgers, debt simplification, filtering, and analytics. | `src/utils/expenseCalculations.js`, `src/pages/ExpensesPage.jsx`, `src/pages/SettlementsPage.jsx` |
| **5. Reusable UI Components** | Configurable, prop-driven primitives (`Button`, `Card`, `Badge`, `Avatar`, `AvatarStack`, `StatCard`, `Modal`, `EmptyState`) reused across all 6 routes. | `src/components/ui/*` |
| **6. Routing with React Router v6** | `BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, dynamic route params (`useParams` on `/groups/:groupId`), programmatic navigation (`useNavigate`), and URL filter state (`useSearchParams`). | `src/App.jsx`, `src/components/layout/AppShell.jsx`, `src/pages/GroupDetailPage.jsx`, `src/pages/ExpensesPage.jsx` |
| **7. Multiple Styling Approaches** | Cohesively combines **4 React styling techniques**:<br>1. **Global CSS & Custom Property Tokens** (`global.css`)<br>2. **Scoped CSS Modules** (`*.module.css`)<br>3. **CSS-in-JS (`styled-components`)** (`FinanceWidgets.jsx`)<br>4. **Dynamic Inline JSX Style Objects** (`Avatar.jsx`, runtime chart/bar widths) | `src/styles/global.css`, `src/components/ui/*.module.css`, `src/components/styled/FinanceWidgets.jsx`, `src/components/ui/Avatar.jsx` |

---

## Project Directory Structure

```text
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── global.css                  # Approach 1: Global CSS & Design Tokens
    ├── data/
    │   └── seedData.js                 # Initial groups, members, expenses & settlements
    ├── utils/
    │   ├── expenseCalculations.js      # Split math, array pipelines & debt simplification
    │   └── formatters.js               # Intl currency/date formatters & CSV export
    ├── context/
    │   └── ExpenseContext.jsx          # Context Provider + Hooks state management
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.jsx            # Responsive sidebar, topbar & mobile tab bar
    │   │   └── AppShell.module.css
    │   ├── ui/                         # Approach 2 & 4: Reusable UI Components + CSS Modules + Inline Styles
    │   │   ├── Avatar.jsx
    │   │   ├── Badge.jsx & Badge.module.css
    │   │   ├── Button.jsx & Button.module.css
    │   │   ├── Card.jsx & Card.module.css
    │   │   ├── EmptyState.jsx
    │   │   ├── Modal.jsx & Modal.module.css
    │   │   └── StatCard.jsx & StatCard.module.css
    │   ├── styled/                     # Approach 3: CSS-in-JS (styled-components)
    │   │   └── FinanceWidgets.jsx
    │   └── expenses/
    │       ├── AddExpenseModal.jsx
    │       ├── CreateGroupModal.jsx
    │       ├── ExpenseItem.jsx & ExpenseItem.module.css
    │       └── SettleUpModal.jsx
    └── pages/
        ├── DashboardPage.jsx & DashboardPage.module.css
        ├── GroupsPage.jsx & Groups.module.css
        ├── GroupDetailPage.jsx
        ├── ExpensesPage.jsx
        ├── SettlementsPage.jsx
        └── AnalyticsPage.jsx
```

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Create optimized production bundle
npm run build
```

Open [http://localhost:5175](http://localhost:5175) or [http://localhost:5173](http://localhost:5173) in your browser.
