import { useState } from 'react';

const ActionButton = ({ type, onClick, children, className = "" }) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `flex justify-center items-center border-none cursor-pointer 
    bg-global-3 hover:bg-global-5 transition-all duration-200 ease-out
    shadow-md hover:shadow-lg active:shadow-sm
    transform hover:scale-105 active:scale-95`;

  const handleClick = (e) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick(e);
  };

  if (type === 'comment') {
    return (
      <button 
        onClick={handleClick}
        className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px]
                    lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1 lg:p-[3px]
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    active:shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                    ${isPressed ? 'animate-pulse' : ''}
                    ${className}`}
      >
        <img 
          src="/images/img_speech_bubble.png"
          alt="comments"
          className={`w-5 h-4 sm:w-6 sm:h-5 lg:w-[30px] lg:h-[30px] 
                     transition-transform duration-200 
                     ${isPressed ? 'scale-110' : ''}`}
        />
      </button>
    );
  }

  if (type === 'share') {
    return (
      <button 
        onClick={handleClick}
        className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4
                    lg:py-[3px] rounded-[15px] lg:rounded-[22px] 
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    active:shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                    ${isPressed ? 'animate-pulse' : ''}
                    ${className}`}
      >
        <img 
          src="/images/share_arrow.png"
          alt="share"
          className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[32px]
                     transition-transform duration-200
                     ${isPressed ? 'scale-110 rotate-12' : ''}`}
        />
        <span className={`text-global-1 text-xs sm:text-sm lg:text-[24px]
          lg:leading-[26px] font-normal transition-all duration-200
          ${isPressed ? 'scale-105' : ''}`}>
          {children}
        </span>
      </button>
    );
  }
};

export default ActionButton;
