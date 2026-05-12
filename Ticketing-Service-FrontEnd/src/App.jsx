import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsListPage from './pages/TicketsListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import NewTicketPage from './pages/NewTicketPage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/ui/Spinner';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsListPage />} />
          <Route path="/tickets/new" element={<NewTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}