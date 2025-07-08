import React from 'react';
import PropTypes from 'prop-types';

const EditText = ({ 
  placeholder = '', 
  value = '', 
  onChange, 
  type = 'text',
  leftIcon = null,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full rounded-[14px] bg-edittext-1 text-edittext-1 font-ropa text-base sm:text-lg md:text-xl lg:text-[30px] leading-[33px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  
  const paddingClasses = leftIcon 
    ? 'pt-2 pr-4 pb-2 pl-12 sm:pt-2.5 sm:pr-5 sm:pb-2.5 sm:pl-14 md:pt-3 md:pr-6 md:pb-3 md:pl-16 lg:pt-[10px] lg:pr-[18px] lg:pb-[10px] lg:pl-[62px]'
    : 'pt-2 pr-4 pb-2 pl-4 sm:pt-2.5 sm:pr-5 sm:pb-2.5 sm:pl-5 md:pt-3 md:pr-6 md:pb-3 md:pl-6 lg:pt-[10px] lg:pr-[18px] lg:pb-[10px] lg:pl-[18px]';

  const inputClasses = `${baseClasses} ${paddingClasses} ${className}`.trim().replace(/\s+/g, ' ');

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 sm:left-3 md:left-4 lg:left-4">
          <img 
            src={leftIcon} 
            alt="input icon" 
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-[30px] lg:h-[30px]"
          />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

EditText.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  leftIcon: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default EditText;