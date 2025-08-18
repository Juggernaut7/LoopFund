import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AuthCallback from './pages/AuthCallback';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GroupsPage from './pages/GroupsPage';
import ContributionsPage from './pages/ContributionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthInitializer from './components/auth/AuthInitializer';
import ToastProvider from './context/ToastContext';
import './App.css'
import JoinGroupPage from './pages/JoinGroupPage';
import { NotificationsProvider } from './context/NotificationsContext';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <AuthInitializer />
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Protected Routes - Dashboard Layout */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/goals/*" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
                <Route path="/groups/*" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
                <Route path="/contributions/*" element={<ProtectedRoute><ContributionsPage /></ProtectedRoute>} />
                <Route path="/analytics/*" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/achievements/*" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/join/:groupId" element={<JoinGroupPage />} />
                
                {/* Redirect to dashboard for any unmatched routes */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationsProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
