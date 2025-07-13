import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`w-full bg-global-1 text-global-4 ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6 md:py-8">
          <div className="text-center">
            <p className="text-sm sm:text-base font-ropa">
              © 2024 Slug Board. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;