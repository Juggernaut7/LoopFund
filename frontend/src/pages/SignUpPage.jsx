import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  ArrowLeft,
  Phone,
  Calendar,
  Loader
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import GoogleOAuthButton from '../components/auth/GoogleOAuthButton';
import EmailVerification from '../components/auth/EmailVerification';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';
import LoopFundCard from '../components/ui/LoopFundCard';
import logo from '../assets/logo.jpg';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Signup failed: ${response.status}`);
      }

      if (data.success && data.data) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('authToken', data.data.token);
        
        login(data.data.user, data.data.token);
        
        // Check if there's a pending invite code
        const pendingInviteCode = localStorage.getItem('pendingInviteCode');
        
        // Check if email verification is required
        if (data.data.requiresVerification && !data.data.user.isVerified) {
          setUserEmail(formData.email);
          setShowEmailVerification(true);
          toast.success('Account created! Please verify your email to continue.');
        } else {
          if (pendingInviteCode) {
            // Auto-join the group after successful signup
            try {
              const joinResponse = await fetch('http://localhost:4000/api/invitations/join', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${data.data.token}`
                },
                body: JSON.stringify({ inviteCode: pendingInviteCode })
              });

              const joinData = await joinResponse.json();

              if (joinResponse.ok && joinData.success) {
                localStorage.removeItem('pendingInviteCode');
                toast.success('Account created and group joined successfully!');
                navigate('/groups');
              } else {
                toast.error(joinData.error || 'Failed to join group automatically');
                toast.success('Account created successfully! Welcome to LoopFund!');
                navigate('/dashboard');
              }
            } catch (joinError) {
              console.error('❌ Auto-join error:', joinError);
              toast.error('Failed to join group automatically');
              toast.success('Account created successfully! Welcome to LoopFund!');
              navigate('/dashboard');
            }
          } else {
            toast.success('Account created successfully! Welcome to LoopFund!');
            navigate('/dashboard');
          }
        }
      } else {
        throw new Error(data.error || 'Signup failed - invalid response format');
      }

    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast.error('Network error - please check your connection and try again');
      } else {
        toast.error(error.message || 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = async (verifiedUser, token) => {
    // Update the user in the store with verified status
    login(verifiedUser, token || localStorage.getItem('token'));
    
    // Check if there's a pending invite code after email verification
    const pendingInviteCode = localStorage.getItem('pendingInviteCode');
    
    if (pendingInviteCode) {
      try {
        // Auto-join the group after successful email verification
        const joinResponse = await fetch('http://localhost:4000/api/invitations/join', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || localStorage.getItem('token')}`
          },
          body: JSON.stringify({ inviteCode: pendingInviteCode })
        });

        const joinData = await joinResponse.json();

        if (joinResponse.ok && joinData.success) {
          localStorage.removeItem('pendingInviteCode');
          toast.success('Email verified and group joined successfully!');
          navigate('/groups');
        } else {
          toast.error(joinData.error || 'Failed to join group automatically');
          toast.success('Email verified successfully! Welcome to LoopFund!');
          navigate('/dashboard');
        }
      } catch (joinError) {
        console.error('❌ Auto-join error after email verification:', joinError);
        toast.error('Failed to join group automatically');
        toast.success('Email verified successfully! Welcome to LoopFund!');
        navigate('/dashboard');
      }
    } else {
      toast.success('Email verified successfully! Welcome to LoopFund!');
      navigate('/dashboard');
    }
  };

  const handleBackToSignup = () => {
    setShowEmailVerification(false);
    setUserEmail('');
  };

  // Show email verification if needed
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <EmailVerification
          email={userEmail}
          onVerified={handleEmailVerified}
          onBack={handleBackToSignup}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-white to-loopfund-coral-50 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-coral-900/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Revolutionary Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-loopfund-coral-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-loopfund-gold-500/10 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-loopfund-emerald-500/10 rounded-full blur-xl animate-float-slow" />
      
      {/* Revolutionary Go Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-200" />
          <span className="font-body text-body-sm font-medium">Go Back</span>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Revolutionary Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center lg:text-left"
          >
            {/* Revolutionary Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto lg:mx-0 mb-6 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 p-1"
            >
              <img 
                src={logo} 
                alt="LoopFund Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            
            {/* Revolutionary Welcome Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-display-xl text-loopfund-midnight-900 dark:text-loopfund-dark-text mb-4"
            >
              Welcome to LoopFund
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-md mx-auto lg:mx-0"
            >
              Start your journey to financial freedom with smart savings and goal tracking
            </motion.p>
            
            {/* Revolutionary Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              {[
                { text: "Smart Goal Setting", icon: "🎯" },
                { text: "Track Your Progress", icon: "📊" },
                { text: "Secure & Private", icon: "🔒" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 group"
                >
                  <motion.span 
                    className="text-2xl transition-transform duration-300"
                  >
                    {feature.icon}
                  </motion.span>
                  <span className="font-body text-body-md text-loopfund-neutral-700 dark:text-loopfund-neutral-300 font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Revolutionary Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            {/* Revolutionary Form Header */}
            <div className="text-center mb-8">
              <h2 className="font-display text-display-lg text-loopfund-midnight-900 dark:text-loopfund-dark-text mb-2">
                Create Account
              </h2>
              <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Join LoopFund and start your savings journey
              </p>
            </div>

            {/* Revolutionary Form Card */}
            <LoopFundCard variant="glass" className="p-8">
              {/* Google OAuth Button */}
              <div className="mb-6">
                <GoogleOAuthButton 
                  text="Sign up with Google" 
                  variant="outline"
                  className="mb-4"
                />
                
                {/* Revolutionary Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-loopfund-neutral-300 dark:border-loopfund-neutral-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-500 dark:text-loopfund-neutral-400 font-body text-body-sm">
                      Or create account with email
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Revolutionary Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LoopFundInput
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    label="First Name"
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                  
                  <LoopFundInput
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    label="Last Name"
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                </div>

                {/* Revolutionary Email */}
                <LoopFundInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  label="Email Address"
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                {/* Revolutionary Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LoopFundInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    label="Password"
                    icon={<Lock className="w-5 h-5" />}
                    required
                    rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />

                  <LoopFundInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    label="Confirm Password"
                    icon={<Lock className="w-5 h-5" />}
                    required
                    rightIcon={showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>

                {/* Revolutionary Additional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LoopFundInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    label="Phone Number"
                    icon={<Phone className="w-5 h-5" />}
                  />
                  
                  <LoopFundInput
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    label="Date of Birth"
                    icon={<Calendar className="w-5 h-5" />}
                  />
                </div>

                {/* Revolutionary Submit Button */}
                <LoopFundButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full group"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </LoopFundButton>

                {/* Revolutionary Sign In Link */}
                <div className="text-center">
                  <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Already have an account?{' '}
                    <Link 
                      to="/signin" 
                      className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors duration-300"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </LoopFundCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage; 