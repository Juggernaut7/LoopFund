import React from 'react';

const CreateGroupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Create New Group
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Start a new savings group with friends and family
          </p>
        </div>

        {/* Simple form placeholder */}
        <div className="glass-card p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Group Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., Vacation Fund"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Target Amount
              </label>
              <input 
                type="number" 
                placeholder="e.g., 3000"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <textarea 
                placeholder="What are you saving for?"
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl"
              />
            </div>
            
            <button className="w-full btn-primary">
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage; 