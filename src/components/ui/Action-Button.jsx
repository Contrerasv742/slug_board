import { useState } from 'react';

const ActionButton = ({ type, onClick, children, className = "", disabled = false }) => {
  const baseClasses = "flex justify-center items-center border-none cursor-pointer \
    bg-global-3/80 hover:bg-purple-600/20 transition-all duration-200 backdrop-blur-sm \
    border border-global-3/30 hover:border-purple-400/40";

  if (type === 'comment') {
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} w-12 h-10 sm:w-14 sm:h-12 lg:w-[56px]
                    lg:h-[44px] rounded-full shadow-md hover:shadow-lg
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <img 
          src="/images/img_speech_bubble.png"
          alt="comments"
          className="w-5 h-4 sm:w-6 sm:h-5 lg:w-[24px] lg:h-[24px] opacity-80"
        />
      </button>
    );
  }

  if (type === 'share') {
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} gap-2 px-4 py-3 sm:px-5 lg:px-6
                    rounded-full shadow-md hover:shadow-lg
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <img 
          src="/images/share_arrow.png"
          alt="share"
          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[18px] lg:h-[18px] opacity-80"
        />
        <span className="text-global-1 text-sm sm:text-base lg:text-[16px]
          font-medium">
          {children}
        </span>
      </button>
    );
  }
};

export default ActionButton;
