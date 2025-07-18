import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  type = 'button',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-ropa font-normal rounded-[14px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center';
  
  const variants = {
    primary: 'bg-button-1 text-global-4 hover:bg-gray-800 disabled:bg-gray-400',
    secondary: 'bg-global-2 text-global-1 hover:bg-gray-300 disabled:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
  };
  
  // Responsive sizes - mobile first approach
  const sizes = {
    small: 'px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base',
    medium: 'px-4 py-2 text-base sm:px-6 sm:py-2.5 sm:text-lg md:px-8 md:py-3 md:text-xl lg:px-[34px] lg:py-[10px] lg:text-[30px] lg:leading-[33px]',
    large: 'px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl',
  };
  
  const buttonClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;