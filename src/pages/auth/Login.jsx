import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        navigate('/student/dashboard');
      } else if (currentUser.role === 'trainer') {
        navigate('/trainer/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-[#0284c7]" />
        <div className="w-1/2 h-full bg-[#f8fafc]" />
      </div>
      {/* Centered login card */}
      <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center z-10">
        <div className="bg-white/90 border border-white/60 shadow-2xl rounded-2xl p-10 w-full backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-600 font-medium">
              Sign in to continue your learning journey
            </p>
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0284c7] transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-[#0284c7] hover:text-[#0369a1] font-semibold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#0284c7] hover:text-[#0369a1] font-semibold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0284c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-600">Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0284c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 