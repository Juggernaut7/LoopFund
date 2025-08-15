import React from 'react';
import { Users, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ name, members, saved, target, progress, nextContribution, dueDate, groupId = 1 }) => {
  const navigate = useNavigate();

  const handleGroupClick = () => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div 
      onClick={handleGroupClick}
      className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            {name}
          </h3>
          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Users className="w-4 h-4 mr-1" />
            {members} members
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            ${saved.toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            of ${target.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
          <span className="text-neutral-900 dark:text-white font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Next Contribution */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center text-neutral-600 dark:text-neutral-400">
          <DollarSign className="w-4 h-4 mr-1" />
          Next: ${nextContribution}
        </div>
        <div className="flex items-center text-neutral-600 dark:text-neutral-400">
          <Calendar className="w-4 h-4 mr-1" />
          Due {dueDate}
        </div>
      </div>
    </div>
  );
};

export default GroupCard; 