import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import UserDashboard from '@/pages/UserDashboard';
import ProtectedRoute from './protectRoute/ProtectedRoute';
import ForgotPassword from './pages/ForgetPassword';
import CreatePassword from './pages/createQAPassword';
import QADashboard from './pages/QADashboard';
import AdminDashboard from './pages/AdminDashboard';
import TranslationTaskPage from './components/freelancer/Tasks';
import TaskReviewPage from './components/qa/TaskReviewPage';
import PageNotFound from './pages/PageNotFound';
import { GlobalDialog } from './components/GlobalDialog';
import { DialogProvider } from './contexts/DialogContext';

function App() {
  return (
    <DialogProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedUserTypes={["freelancer"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedUserTypes={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa-dashboard"
            element={
              <ProtectedRoute allowedUserTypes={["qa_member"]}>
                <QADashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/create-password"
            element={
              <ProtectedRoute allowedUserTypes={["freelancer", "qa_member"]}>
                <CreatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore-task"
            element={
              <ProtectedRoute allowedUserTypes={["freelancer"]}>
                <TranslationTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa-dashboard/review-task"
            element={
              <ProtectedRoute allowedUserTypes={["qa_member"]}>
                <TaskReviewPage />
              </ProtectedRoute>
            }
          />
          <Route path="/page-not-found" element={<PageNotFound />} />
        </Routes>
      </Router>
      {/* Global Dialog Component */}
      <GlobalDialog />
    </DialogProvider>
  );
}

export default App;