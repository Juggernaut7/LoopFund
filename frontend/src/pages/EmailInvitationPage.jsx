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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Invitation</h1>
          <p className="text-slate-600">This invitation is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              You're Invited!
            </h1>
            <p className="text-slate-600">
              Join <strong>{invitation.group.name}</strong> on LoopFund
            </p>
          </div>

          {/* Invitation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          >
            {/* Invitation Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{invitation.group.name}</h2>
                  <p className="text-blue-100">
                    Invited by {invitation.inviter.firstName} {invitation.inviter.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Invitation Content */}
            <div className="p-6">
              {invitation.message && (
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-700 italic">"{invitation.message}"</p>
                </div>
              )}

              {/* Expiration Warning */}
              {isExpired ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">This invitation has expired</p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <p className="text-green-700">
                      Expires on {new Date(invitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Group Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  What you'll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Shared savings goals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Group support & motivation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Progress tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Community chat</span>
                  </div>
                </div>
              </div>

              {/* Sign Up Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Create your account to join
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      disabled={isExpired || accepting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                      disabled={isExpired || accepting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password (min. 6 characters)"
                    disabled={isExpired || accepting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    disabled={isExpired || accepting}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={handleAcceptInvitation}
                  disabled={isExpired || accepting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isExpired
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                  }`}
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : isExpired ? (
                    <span>Invitation Expired</span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Join Group Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Already have account */}
              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailInvitationPage;
