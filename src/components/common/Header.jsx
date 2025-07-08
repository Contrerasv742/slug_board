import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title = 'Slug Board', className = '' }) => {
  return (
    <header className={`w-full bg-global-4 shadow-sm ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          <h1 className="text-lg sm:text-xl md:text-2xl font-ropa font-normal text-global-1">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default Header;