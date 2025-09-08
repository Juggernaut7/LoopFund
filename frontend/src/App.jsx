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
import AuthCallback from './pages/AuthCallback';
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
import AIAdvisorPage from './pages/AIAdvisorPage'; // AI Financial Advisor page
import FinancialTherapistPage from './pages/FinancialTherapistPage'; // AI Financial Therapist page
import CommunityPage from './pages/CommunityPage'; // Financial Wellness Community page
import MicroInterventionsPage from './pages/MicroInterventionsPage'; // Behavioral Interventions page
import PredictiveHealthPage from './pages/PredictiveHealthPage'; // Predictive Financial Health page
import FinancialTherapyGamesPage from './pages/FinancialTherapyGamesPage'; // Financial Therapy Games page
import RevenueDashboard from './pages/RevenueDashboard'; // Revenue Dashboard page
import AdminPage from './pages/AdminPage'; // Admin Dashboard page
import AdminUsersPage from './pages/admin/AdminUsersPage'; // Admin Users Management page
import AdminRevenuePage from './pages/admin/AdminRevenuePage'; // Admin Revenue Analytics page
import PaymentVerificationPage from './pages/PaymentVerificationPage'; // Payment verification page
import CreateGroupPage from './pages/CreateGroupPage'; // Create Group page

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
              <Route path="/auth/callback" element={<AuthCallback />} />
              
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
              
              {/* Create Group route */}
              <Route path="/create-group" element={
                <PrivateRoute>
                  <PageTransition>
                    <CreateGroupPage />
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

              {/* AI Financial Advisor route */}
              <Route path="/ai-advisor" element={
                <PrivateRoute>
                  <PageTransition>
                    <AIAdvisorPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* AI Financial Therapist route */}
              <Route path="/financial-therapist" element={
                <PrivateRoute>
                  <PageTransition>
                    <FinancialTherapistPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Financial Wellness Community route */}
              <Route path="/community" element={
                <PrivateRoute>
                  <PageTransition>
                    <CommunityPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Behavioral Micro-Interventions route */}
              <Route path="/micro-interventions" element={
                <PrivateRoute>
                  <PageTransition>
                    <MicroInterventionsPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Predictive Financial Health route */}
              <Route path="/predictive-health" element={
                <PrivateRoute>
                  <PageTransition>
                    <PredictiveHealthPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Financial Therapy Games route */}
              <Route path="/therapy-games" element={
                <PrivateRoute>
                  <PageTransition>
                    <FinancialTherapyGamesPage />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Revenue Dashboard route */}
              <Route path="/revenue" element={
                <PrivateRoute>
                  <PageTransition>
                    <RevenueDashboard />
                  </PageTransition>
                </PrivateRoute>
              } />

              {/* Payment Verification route */}
              <Route path="/payment/verify/:reference" element={
                <PageTransition>
                  <PaymentVerificationPage />
                </PageTransition>
              } />

              {/* Admin Dashboard route - Public for now */}
              <Route path="/admin" element={
                <PageTransition>
                  <AdminPage />
                </PageTransition>
              } />

              {/* Admin Users Management route */}
              <Route path="/admin/users" element={
                <PageTransition>
                  <AdminUsersPage />
                </PageTransition>
              } />

              {/* Admin Revenue Analytics route */}
              <Route path="/admin/revenue" element={
                <PageTransition>
                  <AdminRevenuePage />
                </PageTransition>
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
