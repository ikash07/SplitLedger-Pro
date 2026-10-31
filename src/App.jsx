import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import ExpensesPage from './pages/ExpensesPage';
import SettlementsPage from './pages/SettlementsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ExpenseProvider>
        <ScrollToTop />
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </ExpenseProvider>
    </BrowserRouter>
  );
}
