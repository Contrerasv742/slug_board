import React, { useState } from 'react';
import Button from '../components/ui/Button';
import EditText from '../components/ui/EditText';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    console.log('Login attempt:', { email, password });
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-global-1 flex flex-col items-center justify-start gap-8 sm:gap-12 md:gap-16 lg:gap-[296px] px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-start w-full max-w-7xl mt-6 sm:mt-8 lg:mt-[34px]">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[80px] lg:h-[80px] bg-global-2 rounded-sm"></div>
        <h1 className="text-global-4 font-ropa text-lg sm:text-2xl md:text-3xl lg:text-[40px] lg:leading-[43px] font-normal ml-4 sm:ml-6 lg:ml-[32px]">
          Slug Board
        </h1>
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[550px] bg-global-3 rounded-lg sm:rounded-xl lg:rounded-[20px] border-2 sm:border-4 border-global-1 p-6 sm:p-8 lg:p-[40px] shadow-lg">
        {/* Login Icon */}
        <div className="flex justify-center mb-6 sm:mb-8 lg:mb-[51px]">
          <div className="bg-global-4 rounded-lg sm:rounded-xl lg:rounded-[14px] p-2 sm:p-3 lg:p-[14px] shadow-md">
            <img 
              src="/images/img_downloading_updates.png" 
              alt="login icon" 
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[60px] lg:h-[60px]"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-[102px]">
          <h2 className="text-global-1 font-ropa text-xl sm:text-2xl md:text-3xl lg:text-[40px] lg:leading-[43px] font-normal mb-2 sm:mb-3 lg:mb-[4px]">
            Sign in with email
          </h2>
          <p className="text-global-3 font-ropa text-sm sm:text-base md:text-lg lg:text-[25px] lg:leading-[26px] font-normal px-2 sm:px-4 lg:px-[18px]">
            Make a new account to post events and connect with others
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-[20px] mb-4 sm:mb-6 lg:mb-[10px]">
          <EditText
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            type="email"
            leftIcon="/images/img_envelope.png"
          />
          
          <div className="relative">
            <EditText
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
              leftIcon="/images/img_lock.png"
              className="pr-12 sm:pr-14 md:pr-16 lg:pr-[48px]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:right-3 md:right-4 lg:right-4"
            >
              <img 
                src="/images/img_invisible.png" 
                alt="toggle password visibility" 
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-[30px] lg:h-[30px]"
              />
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-4 sm:mb-5 lg:mb-[12px]">
          <button className="text-global-1 font-ropa text-sm sm:text-base md:text-lg lg:text-[25px] lg:leading-[27px] font-normal hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="medium"
          fullWidth
          className="mb-4 sm:mb-6 lg:mb-[20px]"
        >
          Get Started
        </Button>

        {/* Or Sign In With */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-[22px]">
          <p className="text-global-2 font-ropa text-sm sm:text-base md:text-lg lg:text-[25px] lg:leading-[27px] font-normal">
            Or sign in with
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 lg:gap-[14px]">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="bg-global-2 rounded-lg sm:rounded-xl lg:rounded-[14px] shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img 
              src="/images/img_app_button.png" 
              alt="Sign in with Google" 
              className="w-24 h-8 sm:w-32 sm:h-10 md:w-36 md:h-12 lg:w-[140px] lg:h-[50px] object-cover"
            />
          </button>
          
          <button
            onClick={() => handleSocialLogin('LinkedIn')}
            className="bg-global-2 rounded-lg sm:rounded-xl lg:rounded-[14px] shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img 
              src="/images/img_app_button_50x140.png" 
              alt="Sign in with LinkedIn" 
              className="w-24 h-8 sm:w-32 sm:h-10 md:w-36 md:h-12 lg:w-[140px] lg:h-[50px] object-cover"
            />
          </button>
          
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="bg-global-2 rounded-lg sm:rounded-xl lg:rounded-[14px] shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img 
              src="/images/img_app_button_1.png" 
              alt="Sign in with Apple" 
              className="w-24 h-8 sm:w-32 sm:h-10 md:w-36 md:h-12 lg:w-[140px] lg:h-[50px] object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
