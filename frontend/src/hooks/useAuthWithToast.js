import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';

export const useAuthWithToast = () => {
  const authStore = useAuthStore();
  
  // Try to get toast context, but don't fail if it's not available
  let toast;
  try {
    toast = useToast();
  } catch (error) {
    // Toast context not available, create a mock toast object
    toast = {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      loading: () => {},
    };
  }

  const loginWithOAuth = async (authData) => {
    console.log('🔍 useAuthWithToast: loginWithOAuth called with:', authData);
    
    try {
      // Call the auth store's loginWithOAuth function
      const result = await authStore.loginWithOAuth(authData);
      console.log('🔍 useAuthWithToast: authStore result:', result);
      
      if (result && result.success) {
        // Get user info from the store after successful login
        const user = authStore.getUser();
        console.log('🔍 useAuthWithToast: user from store:', user);
        
        if (user) {
          toast.success('Welcome!', `Successfully logged in as ${user.firstName || 'User'}`);
        } else {
          toast.success('Welcome!', 'Successfully logged in!');
        }
        
        return result;
      } else {
        console.error('❌ useAuthWithToast: OAuth login failed:', result?.error);
        toast.error('Login Failed', result?.error || 'Authentication failed. Please try again.');
        return { success: false, error: result?.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('❌ useAuthWithToast: Unexpected error:', error);
      toast.error('Login Error', 'An unexpected error occurred during authentication');
      return { success: false, error: error.message || 'Unexpected error occurred' };
    }
  };

  const logout = () => {
    console.log('🔍 useAuthWithToast: logout() called');
    const userName = authStore.user?.firstName || authStore.user?.name || 'User';
    console.log('🔍 useAuthWithToast: Logging out user:', userName);
    
    authStore.logout();
    console.log('🔍 useAuthWithToast: authStore.logout() completed');
    
    toast.success('Logged Out', `Goodbye, ${userName}! You have been successfully logged out.`);
    console.log('🔍 useAuthWithToast: Logout toast shown');
  };

  const updateProfile = async (profileData) => {
    const loadingToast = toast.loading('Updating Profile', 'Please wait while we save your changes');
    
    try {
      const result = await authStore.updateProfile(profileData);
      
      if (result.success) {
        toast.success('Profile Updated', 'Your profile has been successfully updated');
      } else {
        toast.error('Update Failed', result.error || 'Failed to update profile. Please try again.');
      }
      
      return result;
    } catch (error) {
      toast.error('Update Error', 'An unexpected error occurred while updating your profile');
      return { success: false, error: error.message };
    }
  };

  return {
    ...authStore,
    loginWithOAuth,
    logout,
    updateProfile,
  };
}; 