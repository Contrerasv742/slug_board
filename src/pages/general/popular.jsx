import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header.jsx";
import Sidebar from "../../components/common/Sidebar.jsx";
import EventsFeed from "../../components/common/EventsFeed.jsx";
import "../../styles/home.css";

const PopularPage = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">
            Please log in to continue
          </h2>
          <Link
            to="/login"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-[20px] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header
        showSearch={true}
        searchPlaceholder="Search Popular Events"
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
          <div className="w-full max-w-[800px]">
            {/* Popular Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-[38px] lg:leading-tight font-light drop-shadow-lg">
                Popular Events
              </h1>
              <p className="text-white/70 text-sm lg:text-base mt-2">
                Trending events with the most engagement
              </p>
            </div>

            <EventsFeed
              feedType="all"
              limit={30}
              autoRefresh={false}
              showCreateButton={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PopularPage;
