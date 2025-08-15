import React from 'react';
import { Plus, DollarSign, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleMakeContribution = () => {
    // Navigate to first group or show contribution modal
    navigate('/groups/1');
  };

  const handleInviteFriends = () => {
    // Could open a modal or navigate to invite page
    alert('Invite friends functionality coming soon!');
  };

  const handleGroupSettings = () => {
    navigate('/groups/1');
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        <button 
          onClick={handleCreateGroup}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          <div className="flex items-center">
            <Plus className="w-5 h-5 mr-3" />
            <span>Create New Group</span>
          </div>
        </button>
        
        <button 
          onClick={handleMakeContribution}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
        >
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-3" />
            <span>Make Contribution</span>
          </div>
        </button>
        
        <button 
          onClick={handleInviteFriends}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
        >
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-3" />
            <span>Invite Friends</span>
          </div>
        </button>
        
        <button 
          onClick={handleGroupSettings}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-3" />
            <span>Group Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions; 