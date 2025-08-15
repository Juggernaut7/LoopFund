import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl"
                  />
                </div>
                <button className="btn-primary">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Account Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Change Password
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Notification Settings
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 