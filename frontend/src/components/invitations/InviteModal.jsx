import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Users, 
  Copy, 
  CheckCircle, 
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuthStore } from '../../store/useAuthStore';

const InviteModal = ({ isOpen, onClose, group, onInviteSent }) => {
  const [inviteType, setInviteType] = useState('direct'); // 'direct' or 'public'
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [publicInviteLink, setPublicInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuthStore();

  const handleDirectInvite = async (e) => {
    e.preventDefault();
    if (!inviteeEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      console.log('🔑 Token for invitation:', token); // Debug log
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:4000/api/invitations/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inviteeEmail: inviteeEmail.trim(),
          groupId: group._id,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email invitation sent successfully! They will receive an email to join your group.');
        setInviteeEmail('');
        setMessage('');
        onInviteSent && onInviteSent();
      } else {
        throw new Error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Invitation error:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePublicLink = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      console.log('🔑 Token for invitation:', token);
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/invitations/group/${group._id}/public-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response status:', response.status);
      console.log('📋 Response headers:', response.headers);

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('⚠️ Non-JSON response, trying to get text');
        const textResponse = await response.text();
        console.log('📄 Text response:', textResponse);
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok && data.success) {
        setPublicInviteLink(data.data.inviteLink);
        toast.success('Public invite link generated!');
      } else {
        // Handle error response
        const errorMessage = data?.error || data?.message || `Failed to generate invite link (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error generating link:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Cannot read properties of undefined')) {
        toast.error('Server response error - please try again');
      } else {
        toast.error(error.message || 'Failed to generate invitation link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const refreshPublicLink = () => {
    setPublicInviteLink('');
    generatePublicLink();
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Invite to {group.name}
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
              {/* Invite Type Tabs */}
              <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button
                  onClick={() => setInviteType('direct')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    inviteType === 'direct'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Direct Invite
                </button>
                <button
                  onClick={() => setInviteType('public')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    inviteType === 'public'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Public Link
                </button>
              </div>

              {inviteType === 'direct' ? (
                /* Direct Invite Form */
                <form onSubmit={handleDirectInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                      placeholder="Enter any email address (registered or not)"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      required
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      💡 Works for anyone - they'll get an email to join LoopFund and your group
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {message.length}/500 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !inviteeEmail.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </form>
              ) : (
                /* Public Invite Link */
                <div className="space-y-4">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Public Invite Link
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Anyone with this link can join your group
                    </p>
                  </div>

                  {!publicInviteLink ? (
                    <button
                      onClick={generatePublicLink}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <LinkIcon className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Generating...' : 'Generate Invite Link'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <input
                          type="text"
                          value={publicInviteLink}
                          readOnly
                          className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-300 border-none outline-none"
                        />
                        <button
                          onClick={() => copyToClipboard(publicInviteLink)}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                      
                      <button
                        onClick={refreshPublicLink}
                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New Link
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteModal; 