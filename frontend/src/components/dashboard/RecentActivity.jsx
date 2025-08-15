import React from 'react';
import { DollarSign, Users, Calendar, ArrowUpRight } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'contribution',
      user: 'Sarah M.',
      amount: 120,
      group: 'Vacation Fund',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'member_joined',
      user: 'Mike R.',
      group: 'Emergency Fund',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'contribution',
      user: 'Alex J.',
      amount: 100,
      group: 'Tech Gadgets',
      time: '2 days ago'
    },
    {
      id: 4,
      type: 'goal_reached',
      group: 'Vacation Fund',
      time: '3 days ago'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'contribution':
        return <DollarSign className="w-4 h-4 text-success-500" />;
      case 'member_joined':
        return <Users className="w-4 h-4 text-primary-500" />;
      case 'goal_reached':
        return <ArrowUpRight className="w-4 h-4 text-warning-500" />;
      default:
        return <Calendar className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'contribution':
        return `${activity.user} contributed $${activity.amount} to ${activity.group}`;
      case 'member_joined':
        return `${activity.user} joined ${activity.group}`;
      case 'goal_reached':
        return `${activity.group} reached its savings goal!`;
      default:
        return 'Activity occurred';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-900 dark:text-white">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity; 