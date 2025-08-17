import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      // OAuth login method
      loginWithOAuth: async (authData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('loginWithOAuth called with:', authData);
          
          // Store token in localStorage
          localStorage.setItem('authToken', authData.token);

          // For OAuth, we'll create a basic user object from the token
          // The token contains userId and isAdmin, which is sufficient for now
          try {
            const tokenPayload = JSON.parse(atob(authData.token.split('.')[1]));
            console.log('Token payload:', tokenPayload);
            
            const userData = {
              id: tokenPayload.userId,
              firstName: 'User', // We'll get this from profile later if needed
              lastName: '',
              email: '', // We'll get this from profile later if needed
              isAdmin: tokenPayload.isAdmin || false
            };

            console.log('Created user data:', userData);

            set({
              user: userData,
              token: authData.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });

            return { success: true };
          } catch (tokenError) {
            console.error('Error parsing JWT token:', tokenError);
            throw new Error('Invalid JWT token format');
          }
        } catch (error) {
          console.error('loginWithOAuth error:', error);
          set({
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        console.log('AuthStore: logout() called');
        console.log('AuthStore: Current state before logout:', get());
        
        // Clear token from localStorage
        localStorage.removeItem('authToken');
        console.log('AuthStore: Token removed from localStorage');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        console.log('AuthStore: State updated, new state:', get());
        console.log('AuthStore: localStorage after logout:', localStorage.getItem('authToken'));
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          });

          if (!response.ok) {
            throw new Error('Profile update failed');
          }

          const updatedUser = await response.json();
          
          set({
            user: { ...get().user, ...updatedUser },
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      clearError: () => set({ error: null }),

      // Individual setters for direct state updates
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Combined setter for auth state
      setAuthState: (authData) => {
        console.log('🔐 AuthStore: setAuthState called with:', authData);
        console.log('🔐 AuthStore: Token in authData:', authData.token);
        console.log('🔐 AuthStore: Token type:', typeof authData.token);
        console.log('🔐 AuthStore: Token length:', authData.token ? authData.token.length : 0);
        
        // Save token to localStorage for persistence
        if (authData.token) {
          localStorage.setItem('authToken', authData.token);
          console.log('🔐 AuthStore: Token saved to localStorage:', authData.token.substring(0, 20) + '...');
          console.log('🔐 AuthStore: localStorage verification:', localStorage.getItem('authToken') ? 'TOKEN EXISTS' : 'NO TOKEN');
        } else {
          localStorage.removeItem('authToken');
          console.log('🔐 AuthStore: Token removed from localStorage');
        }
        
        set({
          user: authData.user || null,
          token: authData.token || null,
          isAuthenticated: authData.isAuthenticated || false,
          isLoading: false,
          error: null
        });
        
        console.log('🔐 AuthStore: State updated successfully');
        console.log('🔐 AuthStore: Final localStorage state:', localStorage.getItem('authToken') ? 'HAS TOKEN' : 'NO TOKEN');
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      getIsAuthenticated: () => get().isAuthenticated,
      getIsLoading: () => get().isLoading,
      getError: () => get().error,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
export { useAuthStore }; 