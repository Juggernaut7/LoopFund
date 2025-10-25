import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft,
  Loader
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import GoogleOAuthButton from '../components/auth/GoogleOAuthButton';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';
import LoopFundCard from '../components/ui/LoopFundCard';
import logo from '../assets/logo.jpg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const { token, user } = data.data;
        
        // Allow login even if email is not verified
        // Email verification should only be required during signup
        login(user, token);
        toast.success('Successfully logged in! Welcome back! 🎉');
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-white to-loopfund-emerald-50 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-emerald-900/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Revolutionary Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-loopfund-emerald-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-loopfund-coral-500/10 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-loopfund-gold-500/10 rounded-full blur-xl animate-float-slow" />
      
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
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto lg:mx-0 mb-6 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 p-1"
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
              Welcome Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-md mx-auto lg:mx-0"
            >
              Sign in to continue your savings journey and track your progress
            </motion.p>
            
            {/* Revolutionary Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              {[
                { text: "Access Your Goals", icon: "🎯" },
                { text: "View Progress", icon: "📊" },
                { text: "Manage Savings", icon: "💰" }
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
                Sign In
              </h2>
              <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Welcome back to your savings journey
              </p>
            </div>

            {/* Revolutionary Form Card */}
            <LoopFundCard variant="glass" className="p-8">
              {/* Google OAuth Button */}
              <div className="mb-6">
                <GoogleOAuthButton 
                  text="Sign in with Google" 
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
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Revolutionary Email Field */}
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

                {/* Revolutionary Password Field */}
                <LoopFundInput
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                  label="Password"
                  icon={<Lock className="w-5 h-5" />}
                      required
                  rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                />

                {/* Revolutionary Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="font-body text-body-sm text-loopfund-coral-600 dark:text-loopfund-coral-400 font-medium transition-colors duration-300"
                  >
                    Forgot your password?
                  </Link>
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </LoopFundButton>

                {/* Revolutionary Sign Up Link */}
                <div className="text-center">
                  <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors duration-300"
                    >
                      Create Account
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

export default SignInPage; 