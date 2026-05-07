import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verify = async () => {
      try {
        await authService.verify(token);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Verification failed');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">Verifying Email</h2>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-gray-400">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">✅ Email Verified</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
              <Link
                to="/login"
                className="mt-6 inline-block text-blue-400 hover:text-blue-300 transition"
              >
                Go to Login →
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">❌ Verification Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                The verification link may have expired. Please try registering again.
              </p>
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="inline-block text-blue-400 hover:text-blue-300 transition"
                >
                  Register Again
                </Link>
                <span className="text-gray-500">or</span>
                <Link
                  to="/login"
                  className="inline-block text-blue-400 hover:text-blue-300 transition"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
