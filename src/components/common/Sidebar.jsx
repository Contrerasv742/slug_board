import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen = false, onClose, className = '' }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-global-4 shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        ${className}
      `}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl font-ropa font-normal text-global-1">
              Menu
            </h2>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-global-1 hover:bg-global-2 rounded"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/login" 
                  className="block px-3 py-2 text-global-1 hover:bg-global-2 rounded font-ropa"
                >
                  Sign In
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Sidebar;