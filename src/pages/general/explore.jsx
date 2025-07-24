// src/pages/general/explore.jsx
// Real events version using multiple APIs

import React, { useState } from "react";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import EventsFeed from "../../components/common/EventsFeed.jsx";

const ExplorePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header
        showSearch={true}
        searchPlaceholder="Search Events"
        userName="Explorer"
        userHandle="@explore"
        userAvatar="/images/default-avatar.png"
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 pt-20">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 lg:pl-[16%] p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <div className="w-full max-w-[800px]">
            <EventsFeed
              feedType="explore"
              limit={50}
              autoRefresh={false}
              showCreateButton={false}
              searchValue={searchValue}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;