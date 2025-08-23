import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { useAuthStore } from './store/useAuthStore';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GroupsPage from './pages/GroupsPage'; // Make sure this import exists
import ContributionsPage from './pages/ContributionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PageTransition from './components/layout/PageTransition';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';
import AchievementsPage from './pages/AchievementsPage'; // Added missing import

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationsProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              <Route path="/goals" element={
                <PrivateRoute>
                  <PageTransition>
                    <GoalsPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              {/* Make sure this Groups route exists and is correct */}
              <Route path="/groups" element={
                <PrivateRoute>
                  <PageTransition>
                    <GroupsPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              <Route path="/contributions" element={
                <PrivateRoute>
                  <PageTransition>
                    <ContributionsPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              <Route path="/notifications" element={
                <PrivateRoute>
                  <PageTransition>
                    <NotificationsPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              <Route path="/settings" element={
                <PrivateRoute>
                  <PageTransition>
                    <SettingsPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Add the missing achievements route */}
              <Route path="/achievements" element={
                <PrivateRoute>
                  <PageTransition>
                    <AchievementsPage />
                  </PageTransition>
                </PrivateRoute>
              } />
              
              {/* Redirect to dashboard for authenticated users */}
              <Route path="*" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
              } />
            </Routes>
          </Router>
        </NotificationsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
