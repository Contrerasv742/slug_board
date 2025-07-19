import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import EditText from '../../components/ui/EditText';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, signInWithProvider } = useAuth();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Handle Sign Up
        const { error } = await signUp(email, password, {
          email,
          created_at: new Date().toISOString()
        });

        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        // Handle Login
        const { error } = await signIn(email, password);

        if (error) throw error;
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const { data, error } = await signInWithProvider(provider);
      if (error) throw error;
      
      // For OAuth providers, the redirect will happen automatically
      // We don't need to navigate manually as Supabase handles the redirect
      console.log(`${provider} login initiated successfully`);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      alert(`Failed to sign in with ${provider}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      alert('Password reset email sent! Check your inbox.');
      setShowReset(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Temporary reset password landing page
  if (showReset) {
    return (
        <div className="min-h-screen bg-global-1 flex flex-col items-center justify-start gap-8 px-4 sm:px-6 lg:px-8 pt-10">
          <div className="w-[350px] bg-global-3 rounded-[16px] p-6 shadow-lg flex flex-col">
            <div className="flex justify-center mb-4">
              <img
                  src="/images/img_lock.png"
                  alt="reset password"
                  className="w-12 h-12"
              />
            </div>

            <h2 className="text-global-1 font-ropa text-2xl text-center mb-2">
              Reset Password
            </h2>
            <p className="text-global-2 text-center mb-6">
              Enter your email to receive a reset link
            </p>

            <EditText
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                type="email"
                leftIcon="/images/img_envelope.png"
                className="mb-4"
            />

            <Button
                onClick={handlePasswordReset}
                variant="primary"
                fullWidth
                disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <button
                onClick={() => setShowReset(false)}
                className="text-global-2 mt-4 text-center hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-global-1 flex flex-col items-center justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-start w-full mt-4 sm:mt-6 lg:mt-[16px]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-sm">
            <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain"
                alt="Slug Board Logo"
            />
          </div>
          <h1 className="text-global-4 font-ropa text-lg sm:text-xl md:text-2xl lg:text-[28px] lg:leading-[30px] font-normal ml-2 sm:ml-3 lg:ml-[16px] text-starship-animated">
            Slug Board
          </h1>
        </div>

        {/* Login Form Container */}
        <div className="w-[350px] bg-global-3 rounded-[16px] p-[24px] shadow-lg flex flex-col">
          {/* Login Icon */}
          <div className="flex justify-center mb-[12px]">
            <div className="bg-global-3 rounded-[10px] p-[8px] shadow-md border border-gray-200">
              <img
                  src="/images/img_downloading_updates.png"
                  alt="login icon"
                  className="w-[32px] h-[32px]"
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-[16px]">
            <h2 className="text-global-1 font-ropa text-[24px] leading-[26px] font-normal mb-[6px]">
              {isSignUp ? 'Create a new account' : 'Sign in with email'}
            </h2>
            <p className="text-global-3 font-ropa text-[14px] leading-[16px] font-normal px-[20px]">
              {isSignUp
                  ? 'Join to post events and connect with others'
                  : 'Enter your credentials to access your account'}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-[12px] mb-[10px]">
            <EditText
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                type="email"
                leftIcon="/images/img_envelope.png"
                className="text-[12px] lg:text-lg py-[12px] px-[12px] pl-[36px] h-[36px]"
            />

            <div className="relative">
              <EditText
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  leftIcon="/images/img_lock.png"
                  className="text-[12px] lg:text-lg py-[12px] px-[12px] pl-[36px] h-[36px]"
              />
              <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-[8px] top-1/2 transform -translate-y-1/2"
              >
                <img
                    src={showPassword ? "/images/img_visible.png" : "/images/img_invisible.png"}
                    alt="toggle password visibility"
                    className="w-[18px] h-[18px]"
                />
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          {!isSignUp && (
              <div className="text-right mb-[10px]">
                <button
                    className="text-global-1 font-ropa text-[12px] leading-[14px] font-normal hover:underline"
                    onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
          )}

          {/* Get Started Button */}
          <Button
              onClick={handleSubmit}
              variant="primary"
              size="medium"
              fullWidth
              className="mb-[12px] text-[12px] lg:text-xl h-[36px] flex items-center justify-center"
              disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Get Started')}
          </Button>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center mb-[12px]">
            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-global-2 font-ropa text-[12px] leading-[14px] font-normal hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Or Sign In With */}
          <div className="text-center mb-[12px]">
            <p className="text-global-2 font-ropa text-[12px] leading-[14px] font-normal">
              Or sign in with
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-row justify-center items-center gap-[8px]">
            {['Google'].map((provider) => (
                <button
                    key={provider}
                    onClick={() => handleSocialLogin(provider)}
                    className={`flex items-center justify-center bg-global-2 rounded-[8px] shadow-md hover:shadow-lg transition-all duration-200 w-[90px] h-[32px] ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-global-3'
                    }`}
                    disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-global-1 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img
                        src={`/images/${provider.toLowerCase()}.png`}
                        alt={`Sign in with ${provider}`}
                        className="max-w-[70%] max-h-[70%] object-contain"
                    />
                  )}
                </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Login;
