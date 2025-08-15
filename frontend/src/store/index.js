// Export all stores
export { default as useAuthStore } from './useAuthStore';
export { default as useGoalsStore } from './useGoalsStore';
export { default as useGroupsStore } from './useGroupsStore';
export { default as useNotificationsStore } from './useNotificationsStore';

// Store initialization helper
export const initializeStores = async () => {
  try {
    // Initialize stores that need to fetch data on app start
    const { useAuthStore } = await import('./useAuthStore');
    const { useGoalsStore } = await import('./useGoalsStore');
    const { useGroupsStore } = await import('./useGroupsStore');
    const { useNotificationsStore } = await import('./useNotificationsStore');

    // Check if user is authenticated and fetch initial data
    const authStore = useAuthStore.getState();
    if (authStore.isAuthenticated) {
      // Fetch user data
      await useGoalsStore.getState().fetchGoals();
      await useGroupsStore.getState().fetchGroups();
      await useNotificationsStore.getState().fetchNotifications();
    }

    console.log('✅ All stores initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing stores:', error);
  }
};

// Store reset helper (useful for logout)
export const resetAllStores = () => {
  try {
    useAuthStore.getState().logout();
    useGoalsStore.setState({ goals: [], selectedGoal: null, isLoading: false, error: null });
    useGroupsStore.setState({ groups: [], selectedGroup: null, isLoading: false, error: null });
    useNotificationsStore.setState({ notifications: [], unreadCount: 0, isLoading: false, error: null });
    
    console.log('✅ All stores reset successfully');
  } catch (error) {
    console.error('❌ Error resetting stores:', error);
  }
};

// Store status helper
export const getStoreStatus = () => {
  const auth = useAuthStore.getState();
  const goals = useGoalsStore.getState();
  const groups = useGroupsStore.getState();
  const notifications = useNotificationsStore.getState();

  return {
    auth: {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      hasError: !!auth.error
    },
    goals: {
      count: goals.goals.length,
      isLoading: goals.isLoading,
      hasError: !!goals.error
    },
    groups: {
      count: groups.groups.length,
      isLoading: groups.isLoading,
      hasError: !!groups.error
    },
    notifications: {
      count: notifications.notifications.length,
      unreadCount: notifications.unreadCount,
      isLoading: notifications.isLoading,
      hasError: !!notifications.error
    }
  };
}; 