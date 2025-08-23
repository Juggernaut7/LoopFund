import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const JoinGroupModal = ({ isOpen, onClose, inviteCode = '' }) => {
  const [code, setCode] = useState(inviteCode);
  const [isLoading, setIsLoading] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/invitations/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inviteCode: code.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Successfully joined the group!');
        onClose();
        // Navigate to the group page
        navigate(`/groups/${data.data._id}`);
      } else {
        throw new Error(data.error || 'Failed to join group');
      }
    } catch (error) {
      console.error('Join group error:', error);
      toast.error(error.message || 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Join Group
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Enter Invite Code
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use the invite code shared with you to join a group
                </p>
              </div>

              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter 8-character code"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-center text-lg font-mono tracking-wider"
                    maxLength={8}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Joining...' : 'Join Group'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">How to get an invite code?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Ask a group member to share their invite link</li>
                      <li>• Use a public invite link from social media</li>
                      <li>• Get invited directly by email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinGroupModal; 