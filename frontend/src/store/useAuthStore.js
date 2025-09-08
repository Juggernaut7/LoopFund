import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        console.log('🔐 Storing auth data:', { userData, token });
        set({
          user: userData,
          token: token,
          isAuthenticated: true
        });
        // Also store in localStorage for compatibility
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
      },

      loginWithOAuth: async (authData) => {
        try {
          console.log('🔐 OAuth login with data:', authData);
          
          // Fetch user data from backend using the token
          const response = await fetch(`http://localhost:4000/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${authData.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const { user } = await response.json();
          
          // Store auth data
          set({
            user: user,
            token: authData.token,
            isAuthenticated: true
          });
          
          // Also store in localStorage for compatibility
          localStorage.setItem('token', authData.token);
          localStorage.setItem('authToken', authData.token);
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('🔐 OAuth login successful:', user);
          return { success: true, user };
        } catch (error) {
          console.error('🔐 OAuth login error:', error);
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      // Get user from state
      getUser: () => {
        const state = get();
        return state.user;
      },

      // Get token from either state or localStorage
      getToken: () => {
        const state = get();
        const token = state.token || localStorage.getItem('token') || localStorage.getItem('authToken');
        console.log('🔑 Getting token:', token);
        return token;
      },

      // Initialize from localStorage on app start
      initialize: () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        
        if (token && user) {
          set({
            user: user,
            token: token,
            isAuthenticated: true
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
); 