import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import UserDashboard from '@/pages/UserDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import ForgotPassword from './pages/ForgetPassword';
import CreatePassword from './pages/createQAPassword';
import QADashboard from './pages/QADashboard';
import AdminDashboard from './pages/AdminDashboard';
import TranslationTaskPage from './components/freelancer/Tasks';
import TaskReviewPage from './components/qa/TaskReviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
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
        <Route
          path="/explore-task"
          element={
            <ProtectedRoute>
              <TranslationTaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qa-dashboard/review-task"
          element={
            <ProtectedRoute>
              <TaskReviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 