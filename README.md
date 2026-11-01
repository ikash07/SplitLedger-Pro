# 💸 SplitLedger pro — Shared Expense Splitter

A modern, responsive shared expense tracking and debt settlement web application built with **React 18**, **Vite**, and **React Router**.

---

## 🚀 Quick Start

Get the app running locally in 3 simple steps:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# Visit http://localhost:5173
```

To create an optimized production build:
```bash
npm run build
```

---

## ✨ Key Features

- **Multi-Group Workspaces**: Organize expenses across trips, flatmates, dinners, and events.
- **3 Flexible Split Modes**:
  - **Equal Split**: Divide bills equally with automated penny rounding reconciliation.
  - **Exact Amounts**: Allocate specific currency values per participant with live balance validation.
  - **Percentage Split**: Allocate custom percentages with real-time total share calculation.
- **Smart Debt Simplification**: Built-in algorithm that compresses circular debts into the minimum number of repayment transfers.
- **Member Perspective Switcher**: Switch views (*"Viewing as"*) to check personalized net balances (*"Owed to you"* vs *"You owe"*).
- **Multi-Currency Support**: Instant currency switching between `₹ INR`, `$ USD`, `€ EUR`, and `£ GBP`.
- **Search & CSV Export**: Filter expenses by search query, group, category, or payer, and export to CSV in one click.
- **Persistent Storage**: All groups and expenses auto-save to `localStorage` with a 1-click **Reset Demo Dataset** button.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Tooling & Build**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Scoped CSS Modules & Custom Property Tokens

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/       # AppShell, Topbar & Navigation
│   ├── expenses/     # Add Expense, Create Group, Settle Modals & Cards
│   ├── styled/       # Financial widgets & meters
│   └── ui/           # Buttons, Badges, Cards, Avatars & Modals
├── context/          # Global Expense Context & State Management
├── data/             # Initial demo groups, members & expenses
├── pages/            # Dashboard, Groups, Expenses, Settlements, Analytics
├── styles/           # Global design tokens and theme styles
└── utils/            # Calculation math, debt simplification & formatters
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
