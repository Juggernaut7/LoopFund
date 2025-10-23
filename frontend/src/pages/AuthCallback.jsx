import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const { login } = useAuthStore();
  const { toast } = useToast();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) {
        console.log('🔍 AuthCallback: Already processed, skipping...');
        return;
      }
      hasProcessed.current = true;
      try {
        console.log('🔍 AuthCallback: Starting callback handling...');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));
        
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const error = searchParams.get('error');

        console.log('🔍 AuthCallback: Token present:', !!token);
        console.log('🔍 AuthCallback: UserId present:', !!userId);
        console.log('🔍 AuthCallback: Error param:', error);

        setMessage('Verifying authentication...');

        if (error) {
          console.log('❌ AuthCallback: Error parameter found:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (!token || !userId) {
          console.log('❌ AuthCallback: Missing token or userId');
          setStatus('error');
          setMessage('Invalid authentication response.');
          toast.error('Invalid authentication response. Please try signing in again.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        console.log('✅ AuthCallback: Token and userId present, fetching user profile...');
        setMessage('Loading your profile...');

        // Fetch user profile directly using the token
        const response = await fetch('http://localhost:4000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('🔍 AuthCallback: Profile response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔍 AuthCallback: Profile data:', data);

        if (!data.user) {
          throw new Error('Invalid profile response');
        }

        // Store auth data using the regular login method
        console.log('✅ AuthCallback: Logging in user...');
        login(data.user, token);

        setStatus('success');
        setMessage('Welcome! Redirecting to your dashboard...');
        toast.success('Welcome to LoopFund! You have been successfully signed in.');
        
        console.log('🔍 AuthCallback: Redirecting to dashboard in 1.5 seconds...');
        setTimeout(() => {
          console.log('🔍 AuthCallback: Executing navigation to dashboard...');
          navigate('/dashboard', { replace: true });
        }, 1500);
        
      } catch (error) {
        console.error('❌ AuthCallback: Error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        toast.error('An error occurred during authentication. Please try again.');
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    console.log('🔍 AuthCallback: useEffect triggered');
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
          {status === 'error' && 'Authentication Failed'}
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