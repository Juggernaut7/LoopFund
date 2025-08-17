import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuthWithToast } from '../hooks/useAuthWithToast';
import { useToast } from '../context/ToastContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const { loginWithOAuth } = useAuthWithToast();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Starting callback handling...');
        
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const error = searchParams.get('error');

        console.log('AuthCallback: Token:', token ? 'Present' : 'Missing');
        console.log('AuthCallback: UserId:', userId ? 'Present' : 'Missing');
        console.log('AuthCallback: Error param:', error);

        if (error) {
          console.log('AuthCallback: Error parameter found, redirecting to signin');
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast.error('Authentication Failed', 'There was an error during the authentication process. Please try again.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (!token || !userId) {
          console.log('AuthCallback: Missing token or userId');
          setStatus('error');
          setMessage('Invalid authentication response.');
          toast.error('Invalid Response', 'The authentication response was invalid. Please try signing in again.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        console.log('AuthCallback: Token and userId present, proceeding with OAuth login...');

        // Store the token
        localStorage.setItem('authToken', token);
        console.log('AuthCallback: Token stored in localStorage');
        
        // Update auth store with OAuth data
        console.log('AuthCallback: Calling loginWithOAuth...');
        const result = await loginWithOAuth({ token, userId });
        console.log('AuthCallback: loginWithOAuth result:', result);
        
        if (result.success) {
          console.log('AuthCallback: OAuth login successful, setting success status...');
          setStatus('success');
          setMessage('Authentication successful! Redirecting to dashboard...');
          toast.success('Welcome to LoopFund!', 'You have been successfully authenticated and will be redirected to your dashboard.');
          
          console.log('AuthCallback: Redirecting to dashboard in 2 seconds...');
          // Redirect to dashboard
          setTimeout(() => {
            console.log('AuthCallback: Executing navigation to dashboard...');
            navigate('/dashboard');
          }, 2000);
        } else {
          console.log('AuthCallback: OAuth login failed:', result.error);
          setStatus('error');
          setMessage('Failed to complete authentication.');
          toast.error('Authentication Error', 'Failed to complete the authentication process. Please try again.');
          setTimeout(() => navigate('/signin'), 3000);
        }
        
      } catch (error) {
        console.error('AuthCallback: Unexpected error occurred:', error);
        console.error('AuthCallback: Error stack:', error.stack);
        setStatus('error');
        setMessage('An unexpected error occurred.');
        toast.error('Unexpected Error', 'An unexpected error occurred during authentication. Please try again.');
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    console.log('AuthCallback: useEffect triggered, calling handleCallback...');
    handleCallback();
  }, [searchParams, navigate, loginWithOAuth, toast]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Loader className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center max-w-md w-full mx-4"
      >
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>
        
        {status === 'loading' && (
          <div className="space-y-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please wait while we complete your authentication...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Sign In
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback; 