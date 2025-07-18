import { useState } from 'react';

const ActionButton = ({ type, onClick, children, className = "" }) => {
  const baseClasses = "flex justify-center items-center border-none \
    cursor-pointer bg-global-3 hover:bg-global-5 transition-colors";

  if (type === 'comment') {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px]
                    lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1 lg:p-[3px]
                    ${className}`}
      >
        <img 
          src="/images/img_speech_bubble.png"
          alt="comments"
          className="w-5 h-4 sm:w-6 sm:h-5 lg:w-[30px] lg:h-[30px]"
        />
      </button>
    );
  }

  if (type === 'share') {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4
                    lg:py-[3px] rounded-[15px] lg:rounded-[22px] ${className}`}
      >
        <img 
          src="/images/share_arrow.png"
          alt="share"
          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[32px]"
        />
        <span className="text-global-1 text-xs sm:text-sm lg:text-[24px]
          lg:leading-[26px] font-normal">
          {children}
        </span>
      </button>
    );
  }
};

export default ActionButton;
