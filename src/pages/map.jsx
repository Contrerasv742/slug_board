import React from 'react';

const MapPage = () => {
  return (
    <div className="w-full h-screen bg-global-1 font-ropa">
      {/* Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-global-2 rounded-sm">
              <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain"
                alt="Slug mascot"
              />
            </div>
            <h1 className="text-global-4 font-ropa text-xl font-normal ml-3">
              Campus Map
            </h1>
          </div>
          <button className="bg-global-2 hover:bg-global-3 px-4 py-2 rounded-lg">
            Back to Feed
          </button>
        </div>
      </header>
      
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
