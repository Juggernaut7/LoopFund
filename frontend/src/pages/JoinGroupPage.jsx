import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const JoinGroupPage = () => {
  const { inviteCode: urlInviteCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [inviteCode, setInviteCode] = useState(urlInviteCode || '');
  const [showCodeInput, setShowCodeInput] = useState(!urlInviteCode);

  useEffect(() => {
    if (urlInviteCode) {
      fetchGroupDetails(urlInviteCode);
    } else {
      setIsLoading(false);
    }
  }, [urlInviteCode]);

  const fetchGroupDetails = async (code) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/invitations/group/${code}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Group not found or invite expired');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGroup(data.data);
        setInviteCode(code);
      } else {
        throw new Error(data.error || 'Failed to fetch group details');
      }
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter the invite code');
      return;
    }

    // Fetch group details first
    await fetchGroupDetails(inviteCode.trim());
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter the invite code');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Store invite code in localStorage and redirect to signup
      localStorage.setItem('pendingInviteCode', inviteCode.trim());
      toast.info('Please sign up to join the group');
      navigate('/signup');
      return;
    }

    try {
      setIsJoining(true);
      const response = await fetch('http://localhost:4000/api/invitations/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join group');
      }

      if (data.success) {
        toast.success('Successfully joined the group!');
        navigate('/groups');
      } else {
        throw new Error(data.error || 'Failed to join group');
      }
    } catch (err) {
      console.error('Join group error:', err);
      toast.error(err.message || 'Failed to join group');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Invite Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              to="/join-group"
              className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Join Groups</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              You're Invited!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join this savings group and start achieving your financial goals together
            </p>
          </div>

          {/* Group Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {group?.name || 'Savings Group'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {group?.description || 'A collaborative savings group'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {group?.currentAmount ? `$${group.currentAmount.toLocaleString()}` : '$0'}
                </div>
                <div className="text-sm text-slate-500">
                  of ${group?.targetAmount ? group.targetAmount.toLocaleString() : '0'} goal
                </div>
              </div>
            </div>

            {/* Group Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {group?.memberCount || 0}
                </div>
                <div className="text-sm text-slate-500">Members</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {group?.goalsCount || 0}
                </div>
                <div className="text-sm text-slate-500">Goals</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {group?.successRate || 0}%
                </div>
                <div className="text-sm text-slate-500">Success</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Progress</span>
                <span>{group?.progress || 0}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${group?.progress || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* Group Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Collaborative savings with friends and family</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Track progress together</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure and private</span>
              </div>
            </div>
          </motion.div>

          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              {group ? 'Join the Group' : 'Enter Invite Code'}
            </h3>

            {!group && !showCodeInput ? (
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You'll need the invite code to join this group. 
                  Ask the group owner for the code or check your invitation.
                </p>
                <button
                  onClick={() => setShowCodeInput(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Enter Invite Code
                </button>
              </div>
            ) : !group && showCodeInput ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter the invite code"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center text-lg font-mono tracking-widest"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCodeInput(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCodeSubmit}
                    disabled={isLoading || !inviteCode.trim()}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Loading...
                      </>
                    ) : (
                      <>
                        Find Group
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : group ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Ready to join <strong>{group.name}</strong>? Click the button below to become a member.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setGroup(null);
                      setShowCodeInput(true);
                    }}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleJoinGroup}
                    disabled={isJoining}
                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isJoining ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Group
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinGroupPage; 