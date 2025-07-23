import React from "react";

const SimpleLoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we load the application...</p>
      </div>
    </div>
  );
};

export default SimpleLoadingScreen; 