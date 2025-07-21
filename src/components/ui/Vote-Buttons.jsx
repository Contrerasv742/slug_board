import React, { useRef, useEffect, useState } from 'react';

const UpVotesSection = ({
  upvotes = 0,
  light = true,
  small = false,
  upvote_action = () => console.log('upvote'),
  downvote_action = () => console.log('downvote'),
}) => {
  const [voteState, setVoteState] = useState(null); // null, 'up', or 'down'
  const [currentVotes, setCurrentVotes] = useState(upvotes);
  const [animateCount, setAnimateCount] = useState(false);

  const arrow_img = light ? "/images/vote-arrow-black.png" : "/images/vote-arrow-white.png";

  const getContainerBackground = () => {
    if (voteState === 'up') {
      return "bg-purple-500 shadow-purple-200 shadow-lg";
    } else if (voteState === 'down') {
      return "bg-red-500 shadow-red-200 shadow-lg";
    } else {
      return light ? "bg-global-3" : "bg-transparent";
    }
  };

  const getTextColor = () => {
    if (voteState === 'up' || voteState === 'down') {
      return "text-global-4";
    } else {
      return "text-global-1";
    }
  };
  const txt_size = small ? "lg:text-[16px] lg:leading-[18px]" : "lg:text-[24px] lg:leading-[26px]";
  const btn_size = small ? "lg:w-[25px] lg:h-[25px]" : "lg:w-[40px] lg:h-[40px]";
  const arrow_size = small ? "lg:w-[16px] lg:h-[16px]" : "lg:w-[20px] lg:h-[20px]";

  const handleUpvote = () => {
    if (voteState === 'up') {
      // Remove upvote
      setVoteState(null);
      setCurrentVotes(prev => prev - 1);
    } else if (voteState === 'down') {
      // Switch from downvote to upvote
      setVoteState('up');
      setCurrentVotes(prev => prev + 2);
    } else {
      // Add upvote
      setVoteState('up');
      setCurrentVotes(prev => prev + 1);
    }
    setAnimateCount(true);
    setTimeout(() => setAnimateCount(false), 300);
    upvote_action();
  };

  const handleDownvote = () => {
    if (voteState === 'down') {
      // Remove downvote
      setVoteState(null);
      setCurrentVotes(prev => prev + 1);
    } else if (voteState === 'up') {
      // Switch from upvote to downvote
      setVoteState('down');
      setCurrentVotes(prev => prev - 2);
    } else {
      // Add downvote
      setVoteState('down');
      setCurrentVotes(prev => prev - 1);
    }
    setAnimateCount(true);
    setTimeout(() => setAnimateCount(false), 300);
    downvote_action();
  };

  const getButtonClasses = (type) => {
    const baseClasses = `flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
      ${btn_size} rounded-[10px] lg:rounded-[20px] border-none cursor-pointer
      transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
      shadow-sm hover:shadow-md active:shadow-lg`;

    if (type === 'up' && voteState === 'up') {
      return `${baseClasses} bg-purple-600 hover:bg-purple-700 shadow-purple-300 
              shadow-md hover:shadow-purple-400 hover:shadow-lg`;
    } else if (type === 'down' && voteState === 'down') {
      return `${baseClasses} bg-red-600 hover:bg-red-700 shadow-red-300 
              shadow-md hover:shadow-red-400 hover:shadow-lg`;
    } else {
      const containerBg = getContainerBackground();
      if (containerBg.includes('purple')) {
        return `${baseClasses} bg-purple-400 hover:bg-purple-600`;
      } else if (containerBg.includes('red')) {
        return `${baseClasses} bg-red-400 hover:bg-red-600`;
      } else {
        return `${baseClasses} bg-transparent hover:bg-global-5 
                hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]`;
      }
    }
  };

  const getArrowClasses = (type) => {
    const baseClasses = `${arrow_size} transition-all duration-200`;
    
    if (type === 'up' && voteState === 'up') {
      return `${baseClasses} brightness-0 invert scale-110`;
    } else if (type === 'down' && voteState === 'down') {
      return `${baseClasses} brightness-0 invert scale-110 rotate-180`;
    } else {
      return `${baseClasses} w-2 h-2 sm:w-4 sm:h-4 ${type === 'down' ? 'rotate-180' : ''}`;
    }
  };

  const VoteButton = ({ type, onClick }) => (
    <button
      onClick={onClick}
      className={getButtonClasses(type)}
    >
      <img 
        src={arrow_img}
        alt={type === 'up' ? "upvote" : "downvote"}
        className={getArrowClasses(type)}
      />
    </button>
  );

  return (
    <div className={`flex items-center gap-1 lg:gap-0 p-1 lg:p-0 
        rounded-[15px] lg:rounded-[22px] shadow-sm hover:shadow-md 
        transition-all duration-300 ${getContainerBackground()}`}>
      <VoteButton
        type="up" 
        onClick={handleUpvote}
      />
      <span className={`${getTextColor()} text-xs sm:text-sm ${txt_size} font-normal px-2
                       transition-all duration-300 ${animateCount ? 'scale-125 font-bold' : ''}`}>
        {currentVotes}
      </span>
      <VoteButton 
        type="down" 
        onClick={handleDownvote}
      />
    </div>
  );
};

export default UpVotesSection;
