import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SearchView from '../ui/SearchView';

const Header = ({ 
  showSearch = true, 
  searchPlaceholder = "Search Posts",
  userName = "John Doe",
  userHandle = "@johndoe",
  userAvatar = "/images/default-avatar.png"
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (itemName) => {
    setClickedItem(itemName);
    setTimeout(() => setClickedItem(null), 150);
    setShowDropdown(false);
  };

  // Simulate current path for active states
  const [currentPath, setCurrentPath] = useState('/profile');

  const profileMenuItems = [
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: '👤',
      active: currentPath === '/profile' 
    },
    {
      name: 'Saved',
      path: '/saved',
      icon: '🔖',
      active: currentPath === '/saved'
    },
    {
      name: 'Posts',
      path: '/view-posts',
      icon: '📝',
      active: currentPath === '/view-posts'
    }
  ];

  const getItemClasses = (item) => {
    const baseClasses = `flex justify-start items-center gap-2 p-3 rounded-[10px]
      transition-all duration-300 ease-out lg:h-10 border-none cursor-pointer 
      font-normal no-underline relative overflow-hidden group
      transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg w-full`;

    const isHovered = hoveredItem === item.name;
    const isClicked = clickedItem === item.name;

    if (item.active) {
      return `${baseClasses} bg-global-2 text-global-1 shadow-md
              before:absolute before:inset-0 before:bg-gradient-to-r 
              before:from-transparent before:via-white before:via-opacity-10 
              before:to-transparent before:translate-x-[-100%] 
              hover:before:translate-x-[100%] before:transition-transform 
              before:duration-700 ${isClicked ? 'animate-pulse' : ''}`;
    } else {
      return `${baseClasses} bg-global-1 text-sidebar-1 
              hover:bg-global-2 hover:text-global-1 hover:shadow-md
              before:absolute before:inset-0 before:bg-gradient-to-r 
              before:from-transparent before:via-white before:via-opacity-5 
              before:to-transparent before:translate-x-[-100%] 
              hover:before:translate-x-[100%] before:transition-transform 
              before:duration-500 ${isHovered ? 'bg-global-2 text-global-1' : ''}
              ${isClicked ? 'bg-global-3 scale-95' : ''}`;
    }
  };

  return (
    <>
      <header className="bg-global-1 border-b-2 border-white border-opacity-60
        p-4 sm:p-6 lg:p-[16px_32px] w-[100%] fixed top-0 z-50">
        <div className="flex flex-row items-center w-full max-w-full mx-auto relative">
          
          {/* Logo Section */}
          <a href="/home" className="flex items-center flex-shrink-0
            hover:opacity-80 transition-opacity duration-200" >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px]
              lg:h-[40px] bg-global-2 rounded-sm">
              <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain ml-[-1px]"
                alt="Slug mascot"
              />
            </div>
            <h1 className="text-global-4 font-ropa text-sm sm:text-base
              md:text-xl lg:text-3xl lg:leading-[30px] font-normal ml-2
              sm:ml-3 lg:ml-[16px] text-starship-animated">
              Slug Board
            </h1>
          </a>

          {/* Search Bar */}
          {showSearch && (
            <div className="absolute sm:left-[13%] lg:left-[33%] w-[550px]
              max-w-[60%] header-search">
              <SearchView
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                leftIcon="/images/img_search.png"
                className="text-sm sm:text-base md:text-lg lg:text-xl
                lg:leading-[10px] py-[2px] sm:py-[4px] lg:py-[2px] lg:pl-[45px] w-full h-[40px]"
              />
            </div>
          )}

          {/* Profile Button with Dropdown */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 
                        hover:opacity-80 transition-opacity"
            >
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
              <ChevronDown 
                className={`w-4 h-4 text-global-4 transition-all duration-300 ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-global-1 rounded-[10px] shadow-lg 
                             border-2 border-white border-opacity-60 transition-all duration-300 
                             hover:border-opacity-80 overflow-hidden z-50">
                <div className="py-2">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-white border-opacity-20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-global-4 rounded-full overflow-hidden">
                        <img 
                          src={userAvatar} 
                          alt="User profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-global-4">{userName}</p>
                        <p className="text-sm text-white/60">{userHandle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {profileMenuItems.map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => {
                          handleMenuClick(item.name);
                          setCurrentPath(item.path);
                        }}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={getItemClasses(item)}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        {/* Icon with animation */}
                        <span className={`text-lg transition-all duration-300 
                                        ${hoveredItem === item.name || item.active ? 
                                          'scale-110 rotate-12' : ''}`}>
                          {item.icon}
                        </span>
                        
                        {/* Text with enhanced styling */}
                        <span className={`text-lg lg:text-2xl lg:leading-[32px] font-medium
                                        transition-all duration-300 relative
                                        ${hoveredItem === item.name || item.active ? 
                                          'tracking-wide' : 'tracking-normal'}`}>
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white border-opacity-20 my-2"></div>

                  {/* Sign Out Option */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleMenuClick('Sign Out');
                        // Add sign out logic here
                        window.location.href = '/login';
                      }}
                      onMouseEnter={() => setHoveredItem('Sign Out')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex justify-start items-center gap-2 p-3 rounded-[10px] w-full
                                transition-all duration-300 ease-out border-none cursor-pointer 
                                font-normal relative overflow-hidden group
                                transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg
                                bg-global-1 text-sidebar-1 hover:bg-red-500 hover:text-white
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                before:from-transparent before:via-white before:via-opacity-5 
                                before:to-transparent before:translate-x-[-100%] 
                                hover:before:translate-x-[100%] before:transition-transform 
                                before:duration-500 ${hoveredItem === 'Sign Out' ? 'bg-red-500 text-white' : ''}
                                ${clickedItem === 'Sign Out' ? 'bg-red-600 scale-95' : ''}`}
                    >
                      <span className={`text-lg transition-all duration-300 
                                      ${hoveredItem === 'Sign Out' ? 'scale-110 rotate-12' : ''}`}>
                        🚪
                      </span>
                      <span className="text-lg lg:text-2xl lg:leading-[32px] font-medium transition-all duration-300">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </header>

      {/* CSS for animations - moved to regular CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-10px); }
            to { transform: translateY(0); }
          }

          .dropdown-menu {
            animation: fadeIn 0.2s ease-out, slideDown 0.2s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default Header;
