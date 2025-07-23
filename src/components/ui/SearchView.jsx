import React from "react";
import PropTypes from "prop-types";

const SearchView = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  leftIcon = null,
  disabled = false,
  className = "",
  ...props
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const baseClasses =
    "w-full rounded-[20px] bg-global-2 text-global-2 font-ropa transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  const paddingClasses = leftIcon
    ? "pt-2 pr-2.5 pb-2 pl-16 sm:pt-2.5 sm:pr-3 sm:pb-2.5 sm:pl-20 md:pt-3 md:pr-4 md:pb-3 md:pl-24 lg:pt-[10px] lg:pr-[10px] lg:pb-[10px] lg:pl-[80px]"
    : "pt-2 pr-2.5 pb-2 pl-2.5 sm:pt-2.5 sm:pr-3 sm:pb-2.5 sm:pl-3 md:pt-3 md:pr-4 md:pb-3 md:pl-4 lg:pt-[10px] lg:pr-[10px] lg:pb-[10px] lg:pl-[10px]";

  const textSizeClasses =
    "text-base sm:text-lg md:text-2xl lg:text-[40px] lg:leading-[43px]";

  const inputClasses =
    `${baseClasses} ${paddingClasses} ${textSizeClasses} ${className}`
      .trim()
      .replace(/\s+/g, " ");

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 sm:left-3 md:left-4 lg:left-4">
          <img
            src={leftIcon}
            alt="search icon"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[50px] lg:h-[50px]"
          />
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

SearchView.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  leftIcon: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchView;
