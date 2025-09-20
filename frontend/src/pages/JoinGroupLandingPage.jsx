import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  ArrowRight, 
  UserPlus,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import EmailInvitationPage from './EmailInvitationPage';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';

const JoinGroupLandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if this is an email invitation
  const isEmailInvitation = !!token;

  // If this is an email invitation, render the email invitation page
  if (isEmailInvitation) {
    return <EmailInvitationPage />;
  }

  const handleJoinWithCode = () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }
    
    // Navigate to the join group page with the invite code
    navigate(`/join-group/${inviteCode.trim()}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-loopfund-lg"
            >
              <Users className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              Join a Savings Group
            </h1>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-2xl mx-auto">
              Connect with friends and family to achieve your financial goals together.
            </p>
          </div>

          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md mx-auto mb-12"
          >
            <LoopFundCard variant="elevated" className="p-8">
              <div className="text-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Enter Invite Code
                </h3>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Get the invite code from the group owner
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Invite Code
                  </label>
                  <LoopFundInput
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="text-center text-lg font-mono tracking-widest"
                  />
                </div>

                <LoopFundButton
                  onClick={handleJoinWithCode}
                  disabled={isLoading || !inviteCode.trim()}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={isLoading ? null : <ArrowRight className="w-5 h-5" />}
                >
                  {isLoading ? (
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
            </LoopFundCard>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <LoopFundCard variant="elevated" className="p-8">
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-8 text-center">
                Why Join a Savings Group?
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Achieve Goals Together
                  </h4>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Work towards common financial goals with friends and family
                  </p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Secure & Private
                  </h4>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Your financial data is protected with bank-level security
                  </p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-body text-body font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Track Progress
                  </h4>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Monitor your savings progress with real-time updates
                  </p>
                </motion.div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Don't have an invite code? Create your own savings group!
            </p>
            <LoopFundButton
              onClick={() => navigate('/signup')}
              variant="primary"
              size="lg"
              icon={<Users className="w-5 h-5" />}
              className="shadow-loopfund-lg hover:shadow-loopfund-xl"
            >
              Get Started
            </LoopFundButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinGroupLandingPage;
