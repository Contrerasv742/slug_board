import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchView from '../ui/SearchView';

const Header = ({ 
  showSearch = true, 
  searchPlaceholder = "Search events by title...",
  userName = "John Doe",
  userHandle = "@johndoe",
  userAvatar = "/images/default-avatar.png",
  searchValue = "",
  onSearchChange = () => {}
}) => {

  return (
    <header className="bg-global-1 border-b-2 border-white border-opacity-60
      p-4 sm:p-6 lg:p-[16px_32px]">
      <div className="flex flex-row items-center justify-between w-full
        max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">

        {/* Logo Section */}
        <Link to="/home" className="flex items-center flex-shrink-0
          hover:opacity-80 transition-opacity duration-200" >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px]
            lg:h-[40px] bg-global-2 rounded-sm">
            <img
              src="/images/standing-sammy.png"
              className="w-full h-full object-contain"
              alt="Slug mascot"
            />
          </div>
          <h1 className="text-global-4 font-ropa text-lg sm:text-xl
            md:text-2xl lg:text-[28px] lg:leading-[30px] font-normal ml-2
            sm:ml-3 lg:ml-[16px] text-starship-animated">
            Slug Board
          </h1>
        </Link>

        {/* Search Bar - Conditionally Rendered */}
        {showSearch && (
          <div className="pl-[160px] w-[700px] max-w-[950px] header-search">
            <SearchView
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              leftIcon="/images/img_search.png"
              className="text-sm sm:text-base md:text-lg lg:text-xl
              lg:leading-[10px] py-[2px] sm:py-[4px] lg:py-[2px] lg:pl-[45px] w-full h-[40px]"
            />
          </div>
        )}

        {/* Profile Button */}
        <Link to="/profile" className="flex items-center gap-2 sm:gap-3
          lg:gap-4 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="profile-border-animated">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-global-4
              rounded-full overflow-hidden cursor-pointer">
              <img 
                src={userAvatar} 
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-global-4 text-sm lg:text-base font-medium">
              {userName}
            </span>
            <span className="text-white/60 text-xs lg:text-sm">
              {userHandle}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
