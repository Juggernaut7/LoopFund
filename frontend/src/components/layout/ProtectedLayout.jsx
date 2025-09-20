import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Layout from './Layout';

const ProtectedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to signin page with the return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;
