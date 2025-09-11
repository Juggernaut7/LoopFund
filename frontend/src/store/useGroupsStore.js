import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGroupsStore = create(
  persist(
    (set, get) => ({
      // State
      groups: [],
      selectedGroup: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        category: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },

      // Actions
      fetchGroups: async () => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/groups', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch groups');
          }

          const groups = await response.json();
          set({ groups, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
        }
      },

      createGroup: async (groupData) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(groupData)
          });

          if (!response.ok) {
            throw new Error('Failed to create group');
          }

          const newGroup = await response.json();
          set(state => ({
            groups: [...state.groups, newGroup],
            isLoading: false
          }));

          return { success: true, group: newGroup };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      updateGroup: async (groupId, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            throw new Error('Failed to update group');
          }

          const updatedGroup = await response.json();
          set(state => ({
            groups: state.groups.map(group => 
              group._id === groupId ? updatedGroup : group
            ),
            selectedGroup: state.selectedGroup?._id === groupId ? updatedGroup : state.selectedGroup,
            isLoading: false
          }));

          return { success: true, group: updatedGroup };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      deleteGroup: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete group');
          }

          set(state => ({
            groups: state.groups.filter(group => group._id !== groupId),
            selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      joinGroup: async (inviteCode) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/groups/join', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ inviteCode })
          });

          if (!response.ok) {
            throw new Error('Failed to join group');
          }

          const joinedGroup = await response.json();
          set(state => ({
            groups: [...state.groups, joinedGroup],
            isLoading: false
          }));

          return { success: true, group: joinedGroup };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      leaveGroup: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/groups/${groupId}/leave`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to leave group');
          }

          set(state => ({
            groups: state.groups.filter(group => group._id !== groupId),
            selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      addGroupContribution: async (groupId, contributionData) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/groups/${groupId}/contributions`, {
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

          const updatedGroup = await response.json();
          set(state => ({
            groups: state.groups.map(group => 
              group._id === groupId ? updatedGroup : group
            ),
            selectedGroup: state.selectedGroup?._id === groupId ? updatedGroup : state.selectedGroup,
            isLoading: false
          }));

          return { success: true, group: updatedGroup };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      inviteMember: async (groupId, email) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/groups/${groupId}/invite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
          });

          if (!response.ok) {
            throw new Error('Failed to invite member');
          }

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      selectGroup: (group) => set({ selectedGroup: group }),
      clearSelectedGroup: () => set({ selectedGroup: null }),

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
      getFilteredGroups: () => {
        const { groups, filters } = get();
        let filtered = [...groups];

        // Filter by status
        if (filters.status !== 'all') {
          filtered = filtered.filter(group => group.status === filters.status);
        }

        // Filter by category
        if (filters.category !== 'all') {
          filtered = filtered.filter(group => group.category === filters.category);
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

      getGroupProgress: (groupId) => {
        const group = get().groups.find(g => g._id === groupId);
        if (!group) return 0;
        return (group.currentAmount / group.targetAmount) * 100;
      },

      getTotalGroupSavings: () => {
        return get().groups.reduce((total, group) => total + group.currentAmount, 0);
      },

      getActiveGroups: () => {
        return get().groups.filter(group => group.status === 'active');
      },

      getMyGroups: async () => {
        const { getUser } = await import('./useAuthStore');
        const user = getUser();
        return get().groups.filter(group => 
          group.members.some(member => member.user === user?._id)
        );
      },

      getGroupsICreated: async () => {
        const { getUser } = await import('./useAuthStore');
        const user = getUser();
        return get().groups.filter(group => group.createdBy === user?._id);
      },

      // Getters
      getGroups: () => get().groups,
      getSelectedGroup: () => get().selectedGroup,
      getIsLoading: () => get().isLoading,
      getError: () => get().error,
      getFilters: () => get().filters,
    }),
    {
      name: 'groups-storage',
      partialize: (state) => ({
        groups: state.groups,
        selectedGroup: state.selectedGroup,
        filters: state.filters
      })
    }
  )
);

export default useGroupsStore; 