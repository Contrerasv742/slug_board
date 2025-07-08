import React, { useState } from 'react';
import SearchView from '../components/ui/SearchView';
import '../styles/home.css';

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    { name: 'Home', active: true },
    { name: 'Map', active: false },
    { name: 'Explore', active: false },
    { name: 'Popular', active: false }
  ];

  const feedPosts = [
    {
      id: 1,
      userName: 'User Name',
      timeAgo: '2 days ago',
      eventName: 'Event Name...',
      upvotes: 534,
      hasComments: true,
      canShare: true
    },
    {
      id: 2,
      userName: 'User Name',
      timeAgo: '2 days ago',
      eventName: 'Event Name...',
      upvotes: 534,
      hasComments: true,
      canShare: true
    }
  ];

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <img 
              src="/images/img_header_logo.png" 
              alt="Slug Board" 
            />
          </div>
          
          {/* Search */}
          <div className="header-search">
            <SearchView
              placeholder="Search Events"
              value={searchValue}
              onChange={handleSearchChange}
              leftIcon="/images/img_search.png"
              className="search-input"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`sidebar-menu-item ${
                  activeMenuItem === item.name ? 'active' : ''
                }`}
              >
                <span className="sidebar-menu-text">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          aria-label="Open menu"
        >
          <div className="mobile-menu-icon">
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
          </div>
        </button>

        {/* Feed Content */}
        <main className="feed-main">
          <div className="feed-container">
            {feedPosts.map((post) => (
              <article key={post.id} className="post-card">
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-avatar"></div>
                  <div className="post-meta">
                    <span className="post-username">
                      {post.userName} •
                    </span>
                    <span className="post-time">
                      {post.timeAgo}
                    </span>
                  </div>
                </div>

                {/* Event Title */}
                <h2 className="post-title">
                  {post.eventName}
                </h2>

                {/* Event Content Area */}
                <div className={`post-content ${
                  post.id === 1 ? 'variant-1' : 'variant-2'
                }`}>
                </div>

                {/* Post Actions */}
                <div className="post-actions">
                  {/* Upvote Section */}
                  <div className={`upvote-section ${
                    post.id === 1 ? 'variant-1' : 'variant-2'
                  }`}>
                    <button className={`vote-button ${
                      post.id === 1 ? 'variant-1' : 'variant-2'
                    }`}>
                      <img 
                        src="/images/img_arrow.png" 
                        alt="upvote" 
                      />
                    </button>
                    <span className="vote-count">
                      {post.upvotes}
                    </span>
                    <button className={`vote-button ${
                      post.id === 1 ? 'variant-1' : 'variant-2'
                    }`}>
                      <img 
                        src="/images/img_frame_1.png" 
                        alt="downvote" 
                      />
                    </button>
                  </div>

                  {/* Comment Button */}
                  {post.hasComments && (
                    <button className={`comment-button ${
                      post.id === 1 ? 'variant-1' : 'variant-2'
                    }`}>
                      <img 
                        src="/images/img_speech_bubble.png" 
                        alt="comments" 
                      />
                    </button>
                  )}

                  {/* Share Button */}
                  {post.canShare && (
                    <button className={`share-button ${
                      post.id === 1 ? 'variant-1' : 'variant-2'
                    }`}>
                      <img 
                        src="/images/img_forward_arrow.png" 
                        alt="share" 
                      />
                      <span>Share</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
