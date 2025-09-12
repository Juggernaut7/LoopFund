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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
              className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Users className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Join a Savings Group
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connect with friends and family to achieve your financial goals together.
            </p>
          </div>

          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-12"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Enter Invite Code
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get the invite code from the group owner
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center text-lg font-mono tracking-widest"
                />
              </div>

              <button
                onClick={handleJoinWithCode}
                disabled={isLoading || !inviteCode.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
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
                  <>
                    Join Group
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Why Join a Savings Group?
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Achieve Goals Together
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Work towards common financial goals with friends and family
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Secure & Private
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your financial data is protected with bank-level security
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Track Progress
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor your savings progress with real-time updates
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Don't have an invite code? Create your own savings group!
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinGroupLandingPage;
