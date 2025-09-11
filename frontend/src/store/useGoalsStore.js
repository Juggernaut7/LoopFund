import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGoalsStore = create(
  persist(
    (set, get) => ({
      // State
      goals: [],
      selectedGoal: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        category: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },

      // Actions
      fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/goals', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch goals');
          }

          const goals = await response.json();
          set({ goals, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
        }
      },

      createGoal: async (goalData) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/goals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(goalData)
          });

          if (!response.ok) {
            throw new Error('Failed to create goal');
          }

          const newGoal = await response.json();
          set(state => ({
            goals: [...state.goals, newGoal],
            isLoading: false
          }));

          return { success: true, goal: newGoal };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      updateGoal: async (goalId, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/goals/${goalId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            throw new Error('Failed to update goal');
          }

          const updatedGoal = await response.json();
          set(state => ({
            goals: state.goals.map(goal => 
              goal._id === goalId ? updatedGoal : goal
            ),
            selectedGoal: state.selectedGoal?._id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }));

          return { success: true, goal: updatedGoal };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      deleteGoal: async (goalId) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/goals/${goalId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete goal');
          }

          set(state => ({
            goals: state.goals.filter(goal => goal._id !== goalId),
            selectedGoal: state.selectedGoal?._id === goalId ? null : state.selectedGoal,
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      addContribution: async (goalId, contributionData) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/goals/${goalId}/contributions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(contributionData)
          });

          if (!response.ok) {
            throw new Error('Failed to add contribution');
          }

          const updatedGoal = await response.json();
          set(state => ({
            goals: state.goals.map(goal => 
              goal._id === goalId ? updatedGoal : goal
            ),
            selectedGoal: state.selectedGoal?._id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }));

          return { success: true, goal: updatedGoal };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      selectGoal: (goal) => set({ selectedGoal: goal }),
      clearSelectedGoal: () => set({ selectedGoal: null }),

      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      clearFilters: () => set({ 
        filters: {
          status: 'all',
          category: 'all',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      }),

      clearError: () => set({ error: null }),

      // Computed values
      getFilteredGoals: () => {
        const { goals, filters } = get();
        let filtered = [...goals];

        // Filter by status
        if (filters.status !== 'all') {
          filtered = filtered.filter(goal => goal.status === filters.status);
        }

        // Filter by category
        if (filters.category !== 'all') {
          filtered = filtered.filter(goal => goal.category === filters.category);
        }

        // Sort
        filtered.sort((a, b) => {
          const aValue = a[filters.sortBy];
          const bValue = b[filters.sortBy];
          
          if (filters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        return filtered;
      },

      getGoalProgress: (goalId) => {
        const goal = get().goals.find(g => g._id === goalId);
        if (!goal) return 0;
        return (goal.currentAmount / goal.targetAmount) * 100;
      },

      getTotalSavings: () => {
        return get().goals.reduce((total, goal) => total + goal.currentAmount, 0);
      },

      getActiveGoals: () => {
        return get().goals.filter(goal => goal.status === 'active');
      },

      getCompletedGoals: () => {
        return get().goals.filter(goal => goal.status === 'completed');
      },

      // Getters
      getGoals: () => get().goals,
      getSelectedGoal: () => get().selectedGoal,
      getIsLoading: () => get().isLoading,
      getError: () => get().error,
      getFilters: () => get().filters,
    }),
    {
      name: 'goals-storage',
      partialize: (state) => ({
        goals: state.goals,
        selectedGoal: state.selectedGoal,
        filters: state.filters
      })
    }
  )
);

export default useGoalsStore; 