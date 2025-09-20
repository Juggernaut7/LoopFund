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
import GroupDetailsPage from './pages/GroupDetailsPage'; // Group Details page
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PageTransition from './components/layout/PageTransition';
import PrivateRoute from './components/auth/PrivateRoute';
import ProtectedLayout from './components/layout/ProtectedLayout';
import './App.css';
import AchievementsPage from './pages/AchievementsPage'; // Added missing import
import AnalyticsPage from './pages/AnalyticsPage'; // Analytics page
import TransactionsPage from './pages/TransactionsPage'; // Transactions page
import HelpPage from './pages/HelpPage'; // Help page
import CalendarPage from './pages/CalendarPage'; // Calendar page
import AIAdvisorPage from './pages/AIAdvisorPage'; // AI Financial Advisor page
import CommunityPage from './pages/CommunityPage'; // Financial Wellness Community page
import PredictiveHealthPage from './pages/PredictiveHealthPage'; // Predictive Financial Health page
import FinancialTherapyGamesPage from './pages/FinancialTherapyGamesPage'; // Financial Therapy Games page
import RevenueDashboard from './pages/RevenueDashboard'; // Revenue Dashboard page
import AdminPage from './pages/AdminPage'; // Admin Dashboard page
import AdminUsersPage from './pages/admin/AdminUsersPage'; // Admin Users Management page
import AdminRevenuePage from './pages/admin/AdminRevenuePage'; // Admin Revenue Analytics page
import PaymentVerificationPage from './pages/PaymentVerificationPage'; // Payment verification page
import CreateGroupPage from './pages/CreateGroupPage'; // Create Group page
import JoinGroupPage from './pages/JoinGroupPage'; // Join Group page
import JoinGroupLandingPage from './pages/JoinGroupLandingPage'; // Join Group Landing page
import EmailInvitationPage from './pages/EmailInvitationPage'; // Email Invitation page
import DesignSystemDemo from './pages/DesignSystemDemo'; // Design System Demo page

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
              
              {/* Protected routes with persistent layout */}
              <Route path="/dashboard" element={
                <ProtectedLayout>
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/analytics" element={
                <ProtectedLayout>
                  <PageTransition>
                    <AnalyticsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/transactions" element={
                <ProtectedLayout>
                  <PageTransition>
                    <TransactionsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/goals" element={
                <ProtectedLayout>
                  <PageTransition>
                    <GoalsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              {/* Make sure this Groups route exists and is correct */}
              <Route path="/groups" element={
                <ProtectedLayout>
                  <PageTransition>
                    <GroupsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/groups/:groupId" element={
                <ProtectedLayout>
                  <PageTransition>
                    <GroupDetailsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              {/* Create Group route */}
              <Route path="/create-group" element={
                <ProtectedLayout>
                  <PageTransition>
                    <CreateGroupPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              {/* Join Group Landing page - Public route */}
              <Route path="/join-group" element={
                <PageTransition>
                  <JoinGroupLandingPage />
                </PageTransition>
              } />
              
              
              {/* Join Group route - Public route for invite links */}
              <Route path="/join-group/:inviteCode" element={
                <PageTransition>
                  <JoinGroupPage />
                </PageTransition>
              } />
              
              
              
              <Route path="/notifications" element={
                <ProtectedLayout>
                  <PageTransition>
                    <NotificationsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/profile" element={
                <ProtectedLayout>
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                </ProtectedLayout>
              } />
              
              <Route path="/settings" element={
                <ProtectedLayout>
                  <PageTransition>
                    <SettingsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />

              {/* Help page route */}
              <Route path="/help" element={
                <ProtectedLayout>
                  <PageTransition>
                    <HelpPage />
                  </PageTransition>
                </ProtectedLayout>
              } />


              {/* Calendar page route */}
              <Route path="/calendar" element={
                <ProtectedLayout>
                  <PageTransition>
                    <CalendarPage />
                  </PageTransition>
                </ProtectedLayout>
              } />

              {/* Add the missing achievements route */}
              <Route path="/achievements" element={
                <ProtectedLayout>
                  <PageTransition>
                    <AchievementsPage />
                  </PageTransition>
                </ProtectedLayout>
              } />

              {/* AI Financial Advisor route */}
              <Route path="/ai-advisor" element={
                <ProtectedLayout>
                  <PageTransition>
                    <AIAdvisorPage />
                  </PageTransition>
                </ProtectedLayout>
              } />


              {/* Financial Wellness Community route */}
              <Route path="/community" element={
                <ProtectedLayout>
                  <PageTransition>
                    <CommunityPage />
                  </PageTransition>
                </ProtectedLayout>
              } />


              {/* Predictive Financial Health route */}
              <Route path="/predictive-health" element={
                <ProtectedLayout>
                  <PageTransition>
                    <PredictiveHealthPage />
                  </PageTransition>
                </ProtectedLayout>
              } />

              {/* Financial Therapy Games route */}
              <Route path="/therapy-games" element={
                <ProtectedLayout>
                  <PageTransition>
                    <FinancialTherapyGamesPage />
                  </PageTransition>
                </ProtectedLayout>
              } />

              {/* Revenue Dashboard route */}
              <Route path="/revenue" element={
                <ProtectedLayout>
                  <PageTransition>
                    <RevenueDashboard />
                  </PageTransition>
                </ProtectedLayout>
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

              {/* Design System Demo route - Public for showcasing */}
              <Route path="/design-system" element={
                <PageTransition>
                  <DesignSystemDemo />
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
