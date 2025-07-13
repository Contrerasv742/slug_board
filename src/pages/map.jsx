import React from 'react';

const MapPage = () => {
  return (
    <div className="w-full h-screen bg-global-1 font-ropa">
      {/* Header */}
      
      <button 
        onClick={() => window.location.href = '/home'}
        className="flex flex-row items-center justify-start
        flex-shrink-0 bg-transparent border-none cursor-pointer
        hover:opacity-80 transition-opacity duration-200 p-0"
      >
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
      </button>
      {/* Embedded Map */}
      <iframe 
        src="https://maps.ucsc.edu/"
        width="100%" 
        height="100%"
        title="UCSC Interactive Map"
        className="border-none"
      />
    </div>
  );
};

export default MapPage;
