import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/UserDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import ForgotPassword from './pages/ForgetPassword';
import CreatePassword from './pages/createQAPassword';
import QADashboard from './pages/QADashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
        />
        <Route
        path="/qa-dashboard"
        element={
          <ProtectedRoute>
            <QADashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
        path="/create-password"
        element={
          <ProtectedRoute>
            <CreatePassword />
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App; 