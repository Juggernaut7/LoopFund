import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Banknote, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';
import { formatCurrencySimple } from '../utils/currency';

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
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Loading Group Details
          </h2>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Fetching invitation information...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-loopfund"
          >
            <XCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Invite Not Found
          </h1>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
            {error}
          </p>
          <LoopFundButton
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
          >
            Go Home
          </LoopFundButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
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
              className="inline-flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body text-body font-medium">Back to Join Groups</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-loopfund-lg"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              You're Invited!
            </h1>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Join this savings group and start achieving your financial goals together
            </p>
          </div>

          {/* Group Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <LoopFundCard variant="elevated" className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    {group?.name || 'Savings Group'}
                  </h2>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {group?.description || 'A collaborative savings group'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-h2 text-loopfund-emerald-600">
                    {formatCurrencySimple(group?.currentAmount || 0)}
                  </div>
                  <div className="font-body text-body-sm text-loopfund-neutral-500">
                    of {formatCurrencySimple(group?.targetAmount || 0)} goal
                  </div>
                </div>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div 
                  className="text-center p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="w-6 h-6 text-loopfund-emerald-500 mx-auto mb-2" />
                  <div className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {group?.memberCount || 0}
                  </div>
                  <div className="font-body text-body-sm text-loopfund-neutral-500">Members</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Target className="w-6 h-6 text-loopfund-coral-500 mx-auto mb-2" />
                  <div className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {group?.goalsCount || 0}
                  </div>
                  <div className="font-body text-body-sm text-loopfund-neutral-500">Goals</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <TrendingUp className="w-6 h-6 text-loopfund-gold-500 mx-auto mb-2" />
                  <div className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {group?.successRate || 0}%
                  </div>
                  <div className="font-body text-body-sm text-loopfund-neutral-500">Success</div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">
                  <span>Progress</span>
                  <span>{group?.progress || 0}%</span>
                </div>
                <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-dark-elevated rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${group?.progress || 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-3 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full"
                  />
                </div>
              </div>

              {/* Group Features */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  <CheckCircle className="w-4 h-4 text-loopfund-emerald-500" />
                  <span>Collaborative savings with friends and family</span>
                </div>
                <div className="flex items-center space-x-3 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  <CheckCircle className="w-4 h-4 text-loopfund-emerald-500" />
                  <span>Track progress together</span>
                </div>
                <div className="flex items-center space-x-3 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  <CheckCircle className="w-4 h-4 text-loopfund-emerald-500" />
                  <span>Secure and private</span>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <LoopFundCard variant="elevated" className="p-8">
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
                {group ? 'Join the Group' : 'Enter Invite Code'}
              </h3>

              {!group && !showCodeInput ? (
                <div className="text-center">
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                    You'll need the invite code to join this group. 
                    Ask the group owner for the code or check your invitation.
                  </p>
                  <LoopFundButton
                    onClick={() => setShowCodeInput(true)}
                    variant="primary"
                    size="lg"
                    icon={<UserPlus className="w-5 h-5" />}
                  >
                    Enter Invite Code
                  </LoopFundButton>
                </div>
              ) : !group && showCodeInput ? (
                <div className="space-y-6">
                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Invite Code
                    </label>
                    <LoopFundInput
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter the invite code"
                      className="text-center text-lg font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <LoopFundButton
                      onClick={() => setShowCodeInput(false)}
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                    >
                      Cancel
                    </LoopFundButton>
                    <LoopFundButton
                      onClick={handleCodeSubmit}
                      disabled={isLoading || !inviteCode.trim()}
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      icon={isLoading ? null : <ArrowRight className="w-5 h-5" />}
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
                        'Find Group'
                      )}
                    </LoopFundButton>
                  </div>
                </div>
              ) : group ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                      Ready to join <strong>{group.name}</strong>? Click the button below to become a member.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <LoopFundButton
                      onClick={() => {
                        setGroup(null);
                        setShowCodeInput(true);
                      }}
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                    >
                      Back
                    </LoopFundButton>
                    <LoopFundButton
                      onClick={handleJoinGroup}
                      disabled={isJoining}
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      icon={isJoining ? null : <ArrowRight className="w-5 h-5" />}
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
                        'Join Group'
                      )}
                    </LoopFundButton>
                  </div>
                </div>
              ) : null}
            </LoopFundCard>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-8"
          >
            <p className="font-body text-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-loopfund-emerald-600 hover:text-loopfund-emerald-700 font-body text-body font-medium">
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