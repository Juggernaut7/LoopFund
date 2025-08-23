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

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
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