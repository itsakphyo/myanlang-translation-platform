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
import { LanguageProvider } from './contexts/language-context';
import TermsAndConditions from './pages/terms-and-conditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Home from './pages/Home';

function App() {
  return (
    <LanguageProvider>
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
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/page-not-found" element={<PageNotFound />} />
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
        {/* Global Dialog Component */}
        <GlobalDialog />
      </DialogProvider>
    </LanguageProvider>
  );
}

export default App;