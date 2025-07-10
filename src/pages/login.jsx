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
    // Page Settings
    <div className="min-h-screen bg-global-1 flex flex-col items-center
      justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">

      {/* Header Section */}
      <div className="flex flex-row items-center justify-start w-full mt-4
        sm:mt-6 lg:mt-[16px]"> <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12
          md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-sm">
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
            Sign in with email
          </h2>
          <p className="text-global-3 font-ropa text-[14px] leading-[16px] font-normal px-[20px]">
            Make a new account to post events and connect with others
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
                src="/images/img_invisible.png" 
                alt="toggle password visibility" 
                className="w-[18px] h-[18px]"
              />
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-[10px]">
          <button className="text-global-1 font-ropa text-[12px] leading-[14px] font-normal hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="medium"
          fullWidth
          className="mb-[12px] text-[12px] lg:text-xl h-[36px] flex items-center justify-center"
        >
          Get Started
        </Button>

        {/* Or Sign In With */}
        <div className="text-center mb-[12px]">
          <p className="text-global-2 font-ropa text-[12px] leading-[14px] font-normal">
            Or sign in with
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-row justify-center items-center gap-[8px]">
          {['Google', 'LinkedIn', 'Apple'].map((provider) => (
            <button
              key={provider}
              onClick={() => handleSocialLogin(provider)}
              className="flex items-center justify-center bg-global-2 rounded-[8px] shadow-md hover:shadow-lg transition-shadow duration-200 w-[90px] h-[32px]"
            >
              <img 
                src={`/images/${provider.toLowerCase()}.png`}
                alt={`Sign in with ${provider}`} 
                className="max-w-[70%] max-h-[70%] object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
