import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Sidebar = ({ isOpen = false, onClose, className = "" }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);

  const handleMenuClick = (itemName) => {
    // Visual feedback for click
    setClickedItem(itemName);
    setTimeout(() => setClickedItem(null), 150);

    // Close mobile menu if provided
    if (onClose) onClose();
  };

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
      active: location.pathname === "/" || location.pathname === "/home",
    },
    {
      name: "Popular",
      path: "/popular",
      icon: "🔥",
      active: location.pathname === "/popular",
    },
    {
      name: "Explore",
      path: "/explore",
      icon: "🧭",
      active: location.pathname === "/explore",
    },
    {
      name: "Map",
      path: "/map",
      icon: "🗺️",
      active: location.pathname === "/map",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
      active: location.pathname === "/profile",
    },
  ];

  const getItemClasses = (item) => {
    const baseClasses = `flex justify-start items-center gap-2 p-3 rounded-[10px]
      transition-all duration-300 ease-out lg:h-10 border-none cursor-pointer 
      font-normal no-underline relative overflow-hidden group
      transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg`;

    const isHovered = hoveredItem === item.name;
    const isClicked = clickedItem === item.name;

    if (item.active) {
      return `${baseClasses} bg-global-2 text-global-1 shadow-md
              before:absolute before:inset-0 before:bg-gradient-to-r 
              before:from-transparent before:via-white before:via-opacity-10 
              before:to-transparent before:translate-x-[-100%] 
              hover:before:translate-x-[100%] before:transition-transform 
              before:duration-700 ${isClicked ? "animate-pulse" : ""}`;
    } else {
      return `${baseClasses} bg-global-1 text-sidebar-1 
              hover:bg-global-2 hover:text-global-1 hover:shadow-md
              before:absolute before:inset-0 before:bg-gradient-to-r 
              before:from-transparent before:via-white before:via-opacity-5 
              before:to-transparent before:translate-x-[-100%] 
              hover:before:translate-x-[100%] before:transition-transform 
              before:duration-500 ${isHovered ? "bg-global-2 text-global-1" : ""}
              ${isClicked ? "bg-global-3 scale-95" : ""}`;
    }
  };

  return (
    <aside
      className={`hidden lg:flex lg:w-[14%] bg-global-1 border-r-2
        border-white border-opacity-60 p-5 transition-all duration-300 
        hover:border-opacity-80 shadow-sm hover:shadow-md
        fixed left-0 top-[80px] h-screen overflow-y-auto z-40 ${className}`}
    >
      {/* Sidebar header with subtle animation */}
      <div className="w-full">
        <nav className="flex flex-col gap-2 lg:gap-[4px] w-full">
          {menuItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleMenuClick(item.name)}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={getItemClasses(item)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon with animation */}
              <span
                className={`text-lg transition-all duration-300 
                              ${
                                hoveredItem === item.name || item.active
                                  ? "scale-110 rotate-12"
                                  : ""
                              }`}
              >
                {item.icon}
              </span>

              {/* Text with enhanced styling */}
              <span
                className={`text-lg lg:text-2xl lg:leading-[32px] font-medium
                              transition-all duration-300 relative
                              ${
                                hoveredItem === item.name || item.active
                                  ? "tracking-wide"
                                  : "tracking-normal"
                              }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Sidebar;
