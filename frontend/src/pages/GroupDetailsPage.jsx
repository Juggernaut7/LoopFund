import React from 'react';

const GroupDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Vacation Fund
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Group savings for our summer vacation
          </p>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">$1,200</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Total Saved</p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">5</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Members</p>
          </div>
          <div className="glass-card p-6 text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">40%</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Progress</p>
          </div>
        </div>

        {/* Placeholder content */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Group Details
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            This page will show detailed information about the savings group, 
            including member contributions, transaction history, and group settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage; 