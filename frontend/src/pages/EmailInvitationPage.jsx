import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';

const EmailInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuthStore();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (token) {
      fetchInvitationDetails();
    }
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/invitations/email/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitation(data.data);
      } else {
        toast('error', 'Invalid or expired invitation');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      toast('error', 'Failed to load invitation details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast('error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast('error', 'Last name is required');
      return false;
    }
    if (!formData.password) {
      toast('error', 'Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast('error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast('error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleAcceptInvitation = async () => {
    if (!validateForm()) return;

    setAccepting(true);
    try {
      const response = await fetch('http://localhost:4000/api/invitations/email/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invitationToken: token,
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login the user
        const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: invitation.inviter.email, // Use the invited email
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          login(loginData.data.token, loginData.data.user);
          toast('success', 'Welcome to the group! You have successfully joined.');
          navigate('/groups');
        } else {
          toast('success', 'Account created successfully! Please sign in.');
          navigate('/signin');
        }
      } else {
        toast('error', data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast('error', 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
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
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Loading Invitation
          </h2>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Fetching your invitation details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-loopfund"
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">Invalid Invitation</h1>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">This invitation is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              You're Invited!
            </h1>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Join <strong>{invitation.group.name}</strong> on LoopFund
            </p>
          </div>

          {/* Invitation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <LoopFundCard variant="elevated" className="overflow-hidden">
              {/* Invitation Header */}
              <div className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Users className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className="font-display text-h3">{invitation.group.name}</h2>
                    <p className="font-body text-body text-white/90">
                      Invited by {invitation.inviter.firstName} {invitation.inviter.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invitation Content */}
              <div className="p-6">
                {invitation.message && (
                  <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg p-4 mb-6">
                    <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 italic">"{invitation.message}"</p>
                  </div>
                )}

                {/* Expiration Warning */}
                {isExpired ? (
                  <div className="bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-loopfund-coral-500" />
                      <p className="font-body text-body font-medium text-loopfund-coral-700 dark:text-loopfund-coral-300">This invitation has expired</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-loopfund-emerald-500" />
                      <p className="font-body text-body text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                        Expires on {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Group Benefits */}
                <div className="mb-6">
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                    What you'll get:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />
                      <span className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Shared savings goals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />
                      <span className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Group support & motivation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />
                      <span className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Progress tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />
                      <span className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Community chat</span>
                    </div>
                  </div>
                </div>

                {/* Sign Up Form */}
                <div className="space-y-6">
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                    Create your account to join
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        First Name
                      </label>
                      <LoopFundInput
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        disabled={isExpired || accepting}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Last Name
                      </label>
                      <LoopFundInput
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        disabled={isExpired || accepting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Password
                    </label>
                    <LoopFundInput
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password (min. 6 characters)"
                      disabled={isExpired || accepting}
                    />
                  </div>

                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Confirm Password
                    </label>
                    <LoopFundInput
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      disabled={isExpired || accepting}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <LoopFundButton
                    onClick={handleAcceptInvitation}
                    disabled={isExpired || accepting}
                    variant={isExpired ? "secondary" : "primary"}
                    size="lg"
                    className="w-full"
                    icon={accepting ? null : isExpired ? null : <UserPlus className="w-5 h-5" />}
                  >
                    {accepting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : isExpired ? (
                      'Invitation Expired'
                    ) : (
                      <>
                        Join Group Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </LoopFundButton>
                </div>

                {/* Already have account */}
                <div className="mt-6 text-center">
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/signin')}
                      className="text-loopfund-emerald-600 hover:text-loopfund-emerald-700 font-body text-body font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailInvitationPage;
