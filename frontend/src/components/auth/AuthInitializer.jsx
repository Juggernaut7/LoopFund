import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

const AuthInitializer = () => {
  const { isAuthenticated, loginWithOAuth } = useAuthStore();
  const isInitializing = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializing.current) {
      console.log('AuthInitializer: Already initializing, skipping...');
      return;
    }

    // Only run if user is not already authenticated
    if (isAuthenticated) {
      console.log('AuthInitializer: User already authenticated, skipping initialization');
      return;
    }

    // Check if user is already authenticated (has token in localStorage)
    const token = localStorage.getItem('authToken');
    
    if (token) {
      console.log('AuthInitializer: Found token, starting initialization...');
      isInitializing.current = true;
      
      // Validate token with backend
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Token invalid');
      })
      .then(data => {
        // Token is valid, restore auth state
        loginWithOAuth({ token, userId: data.user._id });
        console.log('AuthInitializer: Session restored successfully');
      })
      .catch(error => {
        // Token is invalid, remove it
        localStorage.removeItem('authToken');
        console.log('AuthInitializer: Invalid token removed');
      })
      .finally(() => {
        isInitializing.current = false;
      });
    } else {
      console.log('AuthInitializer: No token found, skipping initialization');
    }
  }, [isAuthenticated, loginWithOAuth]);

  return null; // This component doesn't render anything
};

export default AuthInitializer; 