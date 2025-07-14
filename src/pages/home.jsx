import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import '../styles/home.css'

const HomePage = () => {
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    { name: 'Home', active: true },
    { name: 'Map', active: false },
    { name: 'Explore', active: false },
    { name: 'Popular', active: false }
  ];

  const feedPosts = [
    {
      id: 1,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'Post Name...',
      description: 'Fuck bitches get money',
      upvotes: 534,
      hasComments: true,
      canShare: true
    },
    {
      id: 2,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'Stoners or Boners General Meeting',
      description: 'Stoners Unites',
      upvotes: 420,
      hasComments: true,
      canShare: true
    },
    {
      id: 3,
      userName: 'User Name',
      timeAgo: '2 days ago',
      title: 'Mission or Missionary 101',
      upvotes: 69,
      hasComments: true,
      canShare: true
    }
  ];

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
lg:w-[40px] lg:h-[40px] rounded-[10px] lg:rounded-[20px] border-none
cursor-pointer bg-global-3 hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src="/images/vote-arrow-black.png"
        alt={type === 'up' ? "upvote" : "downvote"}
        className={`w-2 h-2 sm:w-4 sm:h-4 lg:w-[20px] lg:h-[20px] ${type ===
'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center border-none \
      cursor-pointer bg-global-3 hover:bg-global-5 transition-colors";
    
    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px]
                      lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1
                      lg:p-[3px]
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
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3
                      lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px]
                    ${className}`
          }
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

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName="John Doe"
        userHandle="@johndoe"
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar/>

        {/* Mobile Menu Button */}
        <button className="block lg:hidden fixed top-4 left-4 z-50 p-3
          bg-global-1 rounded-lg border border-white border-opacity-60
          cursor-pointer">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1"></span>
          </div>
        </button>

        {/* Feed Content - Centered and Smaller */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex
          justify-center">
          <div className="flex flex-col gap-4 lg:gap-[32px] w-[95%] sm:w-[85%]
            lg:w-[80%] max-w-[800px] mx-auto">
            {feedPosts.map((post) => (
              <article key={post.id} className="bg-global-2 rounded-[35px] p-3
                sm:p-4 lg:p-[24px] w-full">
                {/* Post Header */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3
                  lg:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[56px]
                    lg:h-[56px] bg-global-4 rounded-full flex-shrink-0"></div>
                  <div className="flex items-center gap-2 sm:gap-2
                    lg:gap-[12px] flex-wrap">
                    <span className="text-global-1 text-sm sm:text-base
                      lg:text-[24px] lg:leading-[26px] font-normal">
                      {post.userName} •
                    </span>
                    <span className="text-global-2 text-sm sm:text-base
                      lg:text-[24px] lg:leading-[26px] font-normal">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-global-1 text-base sm:text-lg
                  lg:text-[32px] lg:leading-[36px] font-normal mb-0
                  lg:mb-[0px]">
                  {post.title}
                </h2>

                {/* Post Description */}
                <h4 className="text-global-1 text-sm sm:text-base lg:text-lg
                  lg:leading-[36px] font-normal mb-0 lg:mb-[0px]">
                  {post.description}
                </h4>

                {/* Post Content Area - Reduced Height */}
                <div className="w-full h-32 sm:h-40 lg:h-[320px] bg-global-5
                  rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-3
                  lg:mb-[20px]">
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                  flex-wrap">
                  {/* Upvote Section */}
                  <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0
                    bg-global-3 rounded-[15px] lg:rounded-[22px]">
                    <VoteButton type="up" onClick={() => console.log('upvote')} />
                    <span className="text-global-1 text-xs sm:text-sm
                      lg:text-[24px] lg:leading-[26px] font-normal px-2">
                      {post.upvotes}
                    </span>
                    <VoteButton type="down" onClick={() => console.log('downvote')} />
                  </div>

                  {/* Comment Button */}
                  {post.hasComments && (
                    <ActionButton 
                      type="comment" 
                      onClick={() => console.log('comment')}
                    />
                  )}

                  {/* Share Button */}
                  {post.canShare && (
                    <ActionButton 
                      type="share" 
                      onClick={() => console.log('share')}
                    >
                      Share
                    </ActionButton>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      {/* Create Events */}
      <Link
        to="/create-post"
        className="fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full 
        bg-global-2 hover:bg-global-3 transition-all duration-200 
        shadow-lg hover:shadow-xl transform hover:scale-105
        flex items-center justify-center z-50 no-underline"
      >
        <span className="text-5xl font-bold leading-none text-starship-animated">
          +
        </span>
      </Link>

    </div>
  );
};

export default HomePage;
