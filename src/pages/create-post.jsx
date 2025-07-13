import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchView from '../components/ui/SearchView';
import '../styles/home.css';
import { supabase } from '../supabaseClient';

const CreatePostPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Create Post');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handlePostSubmit = async () => {
    if (!postTitle.trim() || !postDescription.trim()) {
      setError("Please fill in both the title and description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postTitle,
            description: postDescription,
            author_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/home' },
    { name: 'Create Post', path: '/create-post' },
    { name: 'Profile', path: '/profile' },
    { name: 'Map', path: '/map' },
  ];

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
                  lg:w-[40px] lg:h-[40px]
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-global-3
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img
        src="/images/img_arrow.png"
        alt={type === 'up' ? 'upvote' : 'downvote'}
        className={`w-4 h-4 lg:w-5 lg:h-5 ${type === 'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "", disabled = false }) => {
    const baseClasses = "flex justify-center items-center text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal";

    if (type === 'comment') {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img
            src="/images/img_speech_bubble.png"
            alt="comment"
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    if (type === 'share') {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img
            src="/images/share_arrow.png"
            alt="share"
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    if (type === 'post-event') {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3
                      lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px]
                    ${className || 'bg-global-3 hover:bg-global-5'}`
          }
          >
          <img
            src="/images/img_speech_bubble.png"
            alt="post event"
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-global-1">
      {/* Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60 p-4 sm:p-6 lg:p-[16px_32px]">
        <div className="flex flex-row items-center justify-between w-full max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">
          {/* Logo Section */}
          <div className="flex flex-row items-center justify-start flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-sm">
              <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain"
                alt="Slug Board Logo"
              />
            </div>
            <h1 className="text-global-4 font-ropa text-lg sm:text-xl md:text-2xl lg:text-[28px] lg:leading-[30px] font-normal ml-2 sm:ml-3 lg:ml-[16px] text-starship-animated">
              Slug Board
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <SearchView
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search posts..."
            />
          </div>

          {/* User Profile */}
          <div className="flex flex-row items-center justify-end flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-full">
              <img
                src="/images/user-avatar.png"
                className="w-full h-full object-cover rounded-full"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2 border-white border-opacity-60 p-5">
          <nav className="w-full space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex justify-center items-center p-3 rounded-[10px]
                            transition-all duration-200 lg:h-10
                           border-none cursor-pointer font-normal
                           ${activeMenuItem === item.name
                             ? 'bg-global-2 text-global-1'
                             : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                           }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-4xl mx-auto">
            {/* Create Post Form */}
            <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
              <h2 className="text-global-1 text-xl lg:text-[28px] lg:leading-[32px] font-normal mb-6">
                Create New Post
              </h2>

              {/* Post Form */}
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-global-1 text-sm lg:text-[16px] font-normal mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    className="w-full bg-global-3 text-global-1 rounded-[15px] p-4 lg:p-5 border-none outline-none text-sm lg:text-[18px]"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-global-1 text-sm lg:text-[16px] font-normal mb-2">
                    Post Description
                  </label>
                  <textarea
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Describe your post..."
                    rows={6}
                    className="w-full bg-global-3 text-global-1 rounded-[15px] p-4 lg:p-5 border-none outline-none text-sm lg:text-[18px] resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <VoteButton type="up" onClick={() => console.log('upvote')} />
                    <span className="text-global-1 text-sm lg:text-[18px] font-normal">
                      0
                    </span>
                    
                    <ActionButton
                      type="comment"
                      onClick={() => console.log('comment')}
                    >
                      0
                    </ActionButton>
                  </div>

                  {/* Submit Button */}
                  <ActionButton
                    type="post-event"
                    onClick={handlePostSubmit}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Event'}
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
