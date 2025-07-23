import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import EditText from '../../components/ui/EditText';

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signInWithProvider, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user types
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user types
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        navigate('/home');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await signInWithProvider(provider);
      
      if (error) {
        setError(error.message);
      }
      // Note: OAuth redirect will handle navigation
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    // Page Settings
    <div className="min-h-screen bg-global-1 flex flex-col items-center
      justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">

      {/* Header Section */}
      <div className="flex flex-row items-center justify-start w-full mt-4
        sm:mt-6 lg:mt-[16px]"> 
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] 
          lg:h-[40px] bg-global-2 rounded-sm">
          <img
            src="/images/standing-sammy.png"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-global-4 font-ropa text-lg sm:text-xl md:text-2xl
          lg:text-[28px] lg:leading-[30px] font-normal ml-2 sm:ml-3
          lg:ml-[16px] text-starship-animated">
          Slug Board
        </h1>
      </div>

      {/* Login Form Container */}
      <div className="bg-global-3 rounded-[35px] p-6 sm:p-8 lg:p-[40px_48px]
        w-full max-w-md sm:max-w-lg lg:max-w-[520px] shadow-xl">
        
        {/* Welcome Text */}
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-global-1 font-ropa text-xl sm:text-2xl 
            lg:text-[32px] lg:leading-[35px] font-normal mb-2">
            Welcome Back
          </h2>
          <p className="text-global-2 text-sm sm:text-base lg:text-[18px] 
            lg:leading-[20px]">
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-[15px]">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4 lg:mb-6">
          <EditText
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            type="email"
            className="w-full"
            disabled={isLoading}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 lg:mb-8 relative">
          <EditText
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            className="w-full pr-12"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2
              text-global-2 hover:text-global-1 transition-colors"
            disabled={isLoading}
          >
            <img
              src="/images/img_lock.png"
              alt={showPassword ? "Hide password" : "Show password"}
              className="w-5 h-5 lg:w-6 lg:h-6"
            />
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          onClick={handleSubmit}
          fullWidth
          className="mb-4 lg:mb-6"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="flex items-center mb-4 lg:mb-6">
          <div className="flex-1 border-t border-global-2"></div>
          <span className="px-4 text-global-2 text-sm">or</span>
          <div className="flex-1 border-t border-global-2"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 lg:space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-3 lg:p-4
              border border-global-2 rounded-[15px] hover:bg-gray-50 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            <span className="text-global-1 font-ropa text-sm lg:text-base">
              Continue with Google
            </span>
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-3 lg:p-4
              border border-global-2 rounded-[15px] hover:bg-gray-50 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/images/apple.png" alt="Apple" className="w-5 h-5" />
            <span className="text-global-1 font-ropa text-sm lg:text-base">
              Continue with Apple
            </span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-global-2 text-sm lg:text-base">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/create-new-user')}
              className="text-purple-600 hover:text-purple-700 font-medium
                transition-colors"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
