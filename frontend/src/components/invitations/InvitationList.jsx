import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Calendar
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

const InvitationList = ({ type = 'received' }) => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, [type]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const endpoint = type === 'received' 
        ? `${API_BASE_URL}/invitations/user`
        : `${API_BASE_URL}/invitations/group/${groupId}`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setInvitations(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch invitations');
      }
    } catch (error) {
      console.error('Fetch invitations error:', error);
      toast.error('Failed to fetch invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationAction = async (invitationId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/invitations/${invitationId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || `Invitation ${action}ed successfully!`);
        fetchInvitations(); // Refresh the list
      } else {
        throw new Error(data.error || `Failed to ${action} invitation`);
      }
    } catch (error) {
      console.error(`${action} invitation error:`, error);
      toast.error(error.message || `Failed to ${action} invitation`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No {type} invitations
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {type === 'received' 
            ? "You don't have any pending invitations"
            : "This group doesn't have any pending invitations"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {invitations.map((invitation, index) => (
          <motion.div
            key={invitation._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {type === 'received' 
                        ? `Invitation to join ${invitation.group?.name || 'Group'}`
                        : `Invitation for ${invitation.invitee?.firstName || 'User'}`
                      }
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {type === 'received' 
                        ? `From ${invitation.inviter?.firstName || 'User'} ${invitation.inviter?.lastName || ''}`
                        : `Sent ${formatDate(invitation.createdAt)}`
                      }
                    </p>
                  </div>
                </div>

                {invitation.message && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 pl-11">
                    "{invitation.message}"
                  </p>
                )}

                <div className="flex items-center space-x-4 pl-11">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                    {getStatusIcon(invitation.status)}
                    <span className="ml-1 capitalize">{invitation.status}</span>
                  </span>
                  
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Expires {formatDate(invitation.expiresAt)}
                  </span>
                </div>
              </div>

              {invitation.status === 'pending' && type === 'received' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleInvitationAction(invitation._id, 'accept')}
                    className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg transition-colors"
                    title="Accept invitation"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleInvitationAction(invitation._id, 'decline')}
                    className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                    title="Decline invitation"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InvitationList; 