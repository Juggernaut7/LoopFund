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
import LoopFundCard from '../ui/LoopFundCard';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundInput from '../ui/LoopFundInput';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

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
      const response = await fetch(`${API_BASE_URL}/invitations/join`, {
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
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <LoopFundCard variant="elevated" className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Join Group
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-loopfund-neutral-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Enter Invite Code
                  </h3>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Use the invite code shared with you to join a group
                  </p>
                </div>

                <form onSubmit={handleJoinGroup} className="space-y-6">
                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Invite Code
                    </label>
                    <LoopFundInput
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Enter 8-character code"
                      className="text-center text-lg font-mono tracking-wider"
                      maxLength={8}
                      required
                    />
                  </div>

                  <LoopFundButton
                    type="submit"
                    disabled={isLoading || !code.trim()}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  >
                    {isLoading ? 'Joining...' : 'Join Group'}
                  </LoopFundButton>
                </form>

                <div className="mt-6 p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-loopfund-emerald-600 dark:text-loopfund-emerald-400 mt-0.5" />
                    <div className="font-body text-body-sm text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
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
            </LoopFundCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinGroupModal; 