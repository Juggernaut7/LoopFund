import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Globe,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Crown,
  Zap,
  Target,
  Users,
  Banknote,
  TrendingUp,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });
  
  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      allowInvites: true
    }
  });

  const { toast } = useToast();

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await dashboardService.getUserProfile();
      console.log('Raw profile response:', response);
      
      // Handle different response formats
      let userProfile;
      if (response.data) {
        userProfile = response.data;
      } else if (response.user) {
        userProfile = response.user;
      } else {
        userProfile = response;
      }
      
      console.log('Processed user profile:', userProfile);
      
      setProfile(userProfile);
      
      // Populate form with user data, handling both firstName/lastName and name formats
      const firstName = userProfile.firstName || (userProfile.name ? userProfile.name.split(' ')[0] : '');
      const lastName = userProfile.lastName || (userProfile.name ? userProfile.name.split(' ').slice(1).join(' ') : '');
      
      setProfileForm({
        firstName: firstName || '',
        lastName: lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || ''
      });
      
      console.log('Form populated with:', {
        firstName,
        lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        bio: userProfile.bio
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      toast.error('Profile Error', 'Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profileForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      toast.success('Profile Updated', 'Your profile has been successfully updated.');
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Update Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('Password Mismatch', 'New passwords do not match.');
      return;
    }

    if (securityForm.newPassword.length < 6) {
      toast.error('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      toast.success('Password Changed', 'Your password has been successfully updated.');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Password Error', 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Save preferences to localStorage for now (can be moved to backend later)
      localStorage.setItem('loopfund_preferences', JSON.stringify(preferences));
      
      toast.success('Preferences Saved', 'Your preferences have been saved successfully.');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Save Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = () => {
    try {
      const data = {
        profile: profile,
        preferences: preferences,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loopfund-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data Exported', 'Your data has been exported successfully.');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Export Error', 'Failed to export data. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Settings
            </h2>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Preparing your account preferences...
            </p>
          </motion.div>
        </div>
    );
  }

  // Show error state
  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Failed to Load Settings
            </h2>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              {error}
            </p>
            <LoopFundButton 
              onClick={fetchProfile} 
              variant="primary"
              size="lg"
              icon={<Settings className="w-5 h-5" />}
            >
              Try Again
            </LoopFundButton>
          </motion.div>
        </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { id: 'security', name: 'Security', icon: Shield, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'preferences', name: 'Preferences', icon: Settings, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'electric', gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500' },
    { id: 'data', name: 'Data & Privacy', icon: Lock, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full opacity-20 animate-float" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-full opacity-20 animate-float-delayed" />
              
              <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text relative z-10">
                Settings
              </h1>
              <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-2 relative z-10">
                Manage your account preferences and security settings
              </p>
            </div>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LoopFundCard variant="elevated" className="overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-body text-body-sm font-medium flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-loopfund-emerald-500 text-loopfund-emerald-600 dark:text-loopfund-emerald-400'
                        : 'border-transparent text-loopfund-neutral-500 hover:text-loopfund-neutral-700 hover:border-loopfund-neutral-300 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-neutral-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Profile Information
                  </h2>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LoopFundInput
                        label="First Name"
                        type="text"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        placeholder="Enter your first name"
                        icon={<User className="w-4 h-4" />}
                      />
                      
                      <LoopFundInput
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        placeholder="Enter your last name"
                        icon={<User className="w-4 h-4" />}
                      />
                      
                      <LoopFundInput
                        label="Email"
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="Enter your email"
                        icon={<Mail className="w-4 h-4" />}
                      />
                      
                      <LoopFundInput
                        label="Phone"
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="Enter your phone number"
                        icon={<Phone className="w-4 h-4" />}
                      />
                      
                      <div className="md:col-span-2">
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileForm.bio}
                          onChange={handleProfileChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <LoopFundButton
                        type="submit"
                        disabled={isSaving}
                        variant="primary"
                        size="lg"
                        icon={isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </LoopFundButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Security Settings
                  </h2>
                  
                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LoopFundInput
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                        placeholder="Enter current password"
                        icon={<Lock className="w-4 h-4" />}
                      />
                      
                      <LoopFundInput
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                        placeholder="Enter new password"
                        icon={<Lock className="w-4 h-4" />}
                      />
                      
                      <LoopFundInput
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                        placeholder="Confirm new password"
                        icon={<Lock className="w-4 h-4" />}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <LoopFundButton
                        type="submit"
                        disabled={isSaving}
                        variant="primary"
                        size="lg"
                        icon={isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      >
                        {isSaving ? 'Updating...' : 'Change Password'}
                      </LoopFundButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    App Preferences
                  </h2>
                  
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Theme
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => handlePreferenceChange('preferences', 'theme', e.target.value)}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Currency
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => handlePreferenceChange('preferences', 'currency', e.target.value)}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="NGN">NGN (₦)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <LoopFundButton
                        type="submit"
                        disabled={isSaving}
                        variant="primary"
                        size="lg"
                        icon={isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      >
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                      </LoopFundButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Notification Settings
                  </h2>
                  
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Email Notifications
                        </label>
                        <select
                          value={preferences.notifications.email}
                          onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.value === 'true')}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          SMS Notifications
                        </label>
                        <select
                          value={preferences.notifications.sms}
                          onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.value === 'true')}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Push Notifications
                        </label>
                        <select
                          value={preferences.notifications.push}
                          onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.value === 'true')}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <LoopFundButton
                        type="submit"
                        disabled={isSaving}
                        variant="primary"
                        size="lg"
                        icon={isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      >
                        {isSaving ? 'Saving...' : 'Save Notifications'}
                      </LoopFundButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Data & Privacy
                  </h2>
                  
                  <div className="flex space-x-4">
                    <LoopFundButton
                      onClick={exportData}
                      variant="secondary"
                      size="lg"
                      icon={<Download className="w-4 h-4" />}
                    >
                      Export Data
                    </LoopFundButton>
                    
                    <LoopFundButton
                      variant="outline"
                      size="lg"
                      icon={<Trash2 className="w-4 h-4" />}
                      className="border-loopfund-coral-300 text-loopfund-coral-600 hover:bg-loopfund-coral-50 dark:border-loopfund-coral-600 dark:text-loopfund-coral-400 dark:hover:bg-loopfund-coral-900/20"
                    >
                      Delete Account
                    </LoopFundButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
              </div>
            </LoopFundCard>
          </motion.div>
        </div>
      </div>
  );
};

export default SettingsPage; 