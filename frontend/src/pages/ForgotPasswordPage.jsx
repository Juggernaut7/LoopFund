import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  Mail, 
  CheckCircle, 
  RefreshCw,
  Shield,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import AnimatedNetwork from '../components/ui/AnimatedNetwork';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Validation Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    toast.loading('Sending Reset Link', 'Please wait while we send the password reset email...');

    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email Sent!', 'Password reset link has been sent to your email address.');
        setIsSubmitted(true);
      } else {
        toast.error('Failed to Send', data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Network Error', 'Unable to connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast.error('Validation Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    toast.loading('Resending Email', 'Please wait while we resend the password reset email...');

    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email Resent!', 'Password reset link has been resent to your email address.');
      } else {
        toast.error('Failed to Resend', data.error || 'Failed to resend reset email. Please try again.');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      toast.error('Network Error', 'Unable to connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
        {/* Left Side - Success Message */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <Logo size="lg" showText={true} />
              </div>
              
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Check Your Email
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We've sent a password reset link to{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {email}
                </span>
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                What happens next?
              </h3>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Click the link in your email to reset your password</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>The link expires in 1 hour for security</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Check your spam folder if you don't see it</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button>
              
              <button
                onClick={handleBackToSignIn}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-slate-600 dark:text-slate-400">
                Still having trouble?{' '}
                <Link to="/contact" className="text-blue-600 hover:text-blue-500 font-medium">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Animated Network */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-blue-600 items-center justify-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
          </div>
          
          <div className="text-center text-white relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-bold mb-6">Secure Password Reset</h3>
            <p className="text-lg mb-8 text-green-100">
              Your security is our priority. We'll help you get back to saving with confidence.
            </p>
            
            {/* Animated Network Display */}
            <div className="w-64 h-48 mx-auto mb-6">
              <AnimatedNetwork />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">Secure reset process</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">Quick email delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">24/7 support available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Logo size="lg" showText={true} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!email || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </motion.form>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <button
              onClick={handleBackToSignIn}
              className="flex items-center justify-center w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
            
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Animated Network */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
        </div>
        
        <div className="text-center text-white relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-bold mb-6">Reset Your Password</h3>
          <p className="text-lg mb-8 text-blue-100">
            We'll help you get back to your savings goals quickly and securely.
          </p>
          
          {/* Animated Network Display */}
          <div className="w-64 h-48 mx-auto mb-6">
            <AnimatedNetwork />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-lg">Quick & secure process</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-lg">Email verification</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-lg">Instant access restored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 