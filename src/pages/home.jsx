import React, { useState } from 'react';
import SearchView from '../components/ui/SearchView';

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');

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
      eventName: 'Event Name...',
      upvotes: 534,
      hasComments: true,
      canShare: true
    },
    {
      id: 2,
      userName: 'User Name',
      timeAgo: '2 days ago',
      eventName: 'Event Name...',
      upvotes: 534,
      hasComments: true,
      canShare: true
    }
  ];

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 lg:w-[54px] lg:h-[54px] 
                  rounded-[13px] lg:rounded-[26px] border-none cursor-pointer bg-global-3 
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src={type === 'up' ? "/images/img_arrow.png" : "/images/img_frame_1.png"}
        alt={type === 'up' ? "upvote" : "downvote"}
        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[54px] lg:h-[50px]"
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center border-none cursor-pointer bg-global-3 hover:bg-global-5 transition-colors";
    
    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} w-10 h-10 sm:w-12 sm:h-12 lg:w-[58px] lg:h-[58px] 
                      rounded-[20px] lg:rounded-[30px] p-1 lg:p-[4px] ${className}`}
        >
          <img 
            src="/images/img_speech_bubble.png"
            alt="comments"
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[50px] lg:h-[50px]"
          />
        </button>
      );
    }
    
    if (type === 'share') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[6px] px-2 py-2 sm:px-3 lg:px-6 lg:py-[4px] 
                      rounded-[20px] lg:rounded-[30px] ${className}`}
        >
          <img 
            src="/images/img_forward_arrow.png"
            alt="share"
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[50px] lg:h-[50px]"
          />
          <span className="text-global-1 text-sm sm:text-base lg:text-[35px] lg:leading-[38px] font-normal">
            {children}
          </span>
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60 p-4 sm:p-6 lg:p-[30px_36px]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 lg:gap-0 w-full max-w-full mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/images/img_header_logo.png" 
              alt="Slug Board"
              className="w-48 h-12 sm:w-56 sm:h-14 md:w-64 md:h-16 lg:w-[274px] lg:h-[80px]"
            />
          </div>
          
          {/* Search */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md md:max-w-lg lg:max-w-[66%]">
            <SearchView
              placeholder="Search Events"
              value={searchValue}
              onChange={handleSearchChange}
              leftIcon="/images/img_search.png"
              className="text-sm sm:text-base md:text-lg lg:text-[40px] lg:leading-[43px]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2 border-white border-opacity-60 p-10">
          <nav className="flex flex-col gap-6 lg:gap-[44px] w-full">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex justify-center items-center p-3 rounded-[20px] transition-all duration-200 
                           border-none cursor-pointer font-normal
                           ${activeMenuItem === item.name 
                             ? 'bg-global-2 text-global-1' 
                             : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                           }`}
              >
                <span className="text-lg lg:text-[35px] lg:leading-[38px]">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button className="block lg:hidden fixed top-4 left-4 z-50 p-3 bg-global-1 rounded-lg border border-white border-opacity-60 cursor-pointer">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1"></span>
          </div>
        </button>

        {/* Feed Content */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px]">
          <div className="flex flex-col gap-6 lg:gap-[44px] w-[95%] sm:w-[85%] lg:w-full max-w-[2400px] sm:max-w-[750px] lg:max-w-[2600px] mx-auto">
            {feedPosts.map((post) => (
              <article key={post.id} className="bg-global-2 rounded-[50px] p-4 sm:p-6 lg:p-[30px] w-[95%]">
                {/* Post Header */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-4 lg:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[74px] lg:h-[74px] bg-global-4 rounded-full flex-shrink-0"></div>
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-[18px] flex-wrap">
                    <span className="text-global-1 text-base sm:text-lg lg:text-[35px] lg:leading-[38px] font-normal">
                      {post.userName} •
                    </span>
                    <span className="text-global-2 text-base sm:text-lg lg:text-[35px] lg:leading-[38px] font-normal">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Event Title */}
                <h2 className="text-global-1 text-lg sm:text-xl lg:text-[45px] lg:leading-[49px] font-normal mb-3 lg:mb-[10px]">
                  {post.eventName}
                </h2>

                {/* Event Content Area */}
                <div className="w-full h-48 sm:h-64 lg:h-[504px] bg-global-5 rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] mb-4 lg:mb-[30px]">
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-[18px] flex-wrap">
                  {/* Upvote Section */}
                  <div className="flex items-center gap-2 lg:gap-0 p-1 lg:p-0 bg-global-3 rounded-[20px] lg:rounded-[30px]">
                    <VoteButton type="up" onClick={() => console.log('upvote')} />
                    <span className="text-global-1 text-sm sm:text-base lg:text-[35px] lg:leading-[38px] font-normal px-2">
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
    </div>
  );
};

export default HomePage;
