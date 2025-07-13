import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen = false, onClose, className = '' }) => {
  const location = useLocation();

  const handleMenuClick = () => {
    if (onClose) onClose(); // Close mobile menu if provided
  };

  const menuItems = [
    { name: 'Home', path: '/', active: location.pathname === '/' },
    { name: 'Map', path: '/map', active: location.pathname === '/map' },
    { name: 'Explore', path: '/explore', active: location.pathname === '/explore' },
    { name: 'Popular', path: '/popular', active: location.pathname === '/popular' },
    { name: 'Profile', path: '/profile', active: location.pathname === '/profile' },
  ];

  // Function to check if a menu item is active
  const isActiveMenuItem = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`hidden lg:flex lg:w-[16%] bg-global-1 border-r-2
      border-white border-opacity-60 p-5 ${className}`}>
      <nav className="flex flex-col gap-6 lg:gap-[2px] w-full">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleMenuClick}
            className={`flex justify-center items-center p-3 rounded-[10px]
              transition-all duration-200 lg:h-10 border-none cursor-pointer 
              font-normal no-underline
              ${isActiveMenuItem(item.path)
                ? 'bg-global-2 text-global-1' 
                : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
              }`}
          >
            <span className="text-lg lg:text-3xl lg:leading-[38px]">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Sidebar;
