import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import EventsFeed from "../../components/common/EventsFeed.jsx";
import "../../styles/home.css";

const HomePage = () => {
  const { user, profile, loading } = useAuth();

  // Don't show loading screen for HomePage - let it render with defaults

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName={profile?.name || profile?.username || "John Doe"}
        userHandle={profile?.username ? `@${profile.username}` : "@johndoe"}
        userAvatar={profile?.avatar_url || "/images/default-avatar.png"}
      />

      {/* Main Content */}
      <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-20">
        {/* Sidebar */}
        <Sidebar />

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden fixed top-4 left-4 z-50 p-3
          bg-global-1 rounded-lg border border-white border-opacity-60
          cursor-pointer"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1"></span>
          </div>
        </button>

        {/* Feed Content */}
        <main className="flex-1 lg:pl-[16%] p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <EventsFeed
            feedType="all"
            limit={50}
            autoRefresh={true}
            showCreateButton={true}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
