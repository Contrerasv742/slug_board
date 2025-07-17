import React, { useRef, useEffect, useState } from 'react';

const UpVotesSection = ({
  upvotes = 0,
  light = true,
  small=false,
  upvote_action = () => console.log('upvote'),
  downvote_action = () => console.log('downvote'),
}) => {
  const arrow_img = light ? "/images/vote-arrow-black.png":
                            "/images/vote-arrow-white.png";

  const background = light ? "bg-global-3" : 
                             "bg-transparent";

  const txt_color = light ? "text-global-1" :
                            "text-global-4";

  const txt_size = small ? "lg:text-[16px] lg:leading-[18px]" :
                           "lg:text-[24px] lg:leading-[26px]";

  const btn_size = small ? "lg:w-[25px] lg:h-[25px]" :
                           "lg:w-[40px] lg:h-[40px]" ;

  const arrow_size = small ? "lg:w-[16px] lg:h-[16px] " :
                             "lg:w-[20px] lg:h-[20px] ";


  const VoteButton = ({ type, onClick, rotate }) => (
    <button
      onClick={type === 'up' ? upvote_action : downvote_action}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
      ${btn_size} rounded-[10px] lg:rounded-[20px] border-none
      cursor-pointer ${background} hover:bg-global-5 transition-colors`}
    >
      <img 
        src={`${arrow_img}`}
        alt={type === 'up' ? "upvote" : "downvote"}
        className={`w-2 h-2 sm:w-4 sm:h-4 ${arrow_size} ${rotate}`} 
      />
    </button>
  );

  return (
    <div className={`flex items-center gap-1 lg:gap-0 p-1 lg:p-0 ${background}
        rounded-[15px] lg:rounded-[22px]`}>
      <VoteButton
        type="up" 
        onClick={() => upvote_action} 
        rotate=""
      />
      <span className={`${txt_color} text-xs sm:text-sm
         ${txt_size} font-normal px-2`}>
        {upvotes}
      </span>
      <VoteButton 
        type="down" 
        onClick={() => downvote_action}
        rotate="rotate-180"
      />
    </div>
  )
};

export default UpVotesSection;
