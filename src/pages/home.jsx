import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchView from '../components/ui/SearchView';
import '../styles/home.css'
import { supabase } from '../supabaseClient';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import CommentSection from '../components/ui/CommentSection';

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')


const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [visibleComments, setVisibleComments] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          created_at,
          author_id,
          profiles (
            username
          ),
          upvotes (
            user_id
          ),
          comments (
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data.map(post => ({...post, upvotes: post.upvotes.length, comments: post.comments.length})));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    if (!user) {
      setError("You must be logged in to upvote.");
      return;
    }
    try {
      // Check if user has already upvoted
      const { data: existingUpvote, error: checkError } = await supabase
        .from('upvotes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (checkError) throw checkError;

      if (existingUpvote.length > 0) {
        // User has already upvoted, so we can implement a 'downvote' or just prevent another upvote
        setError("You have already upvoted this post.");
        return;
      }
      
      const { error } = await supabase
        .from('upvotes')
        .insert([{ post_id: postId, user_id: user.id }]);

      if (error) throw error;

      // Refresh posts to show new upvote count
      fetchPosts();

    } catch (error) {
      setError(error.message);
    }
  };

  const toggleComments = (postId) => {
    if (visibleComments === postId) {
      setVisibleComments(null);
    } else {
      setVisibleComments(postId);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
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
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 lg:w-[40px] lg:h-[40px] 
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-global-3 
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src={type === 'up' ? '/images/img_arrow.png' : '/images/img_arrow.png'} 
        alt={type === 'up' ? 'upvote' : 'downvote'}
        className={`w-4 h-4 lg:w-5 lg:h-5 ${type === 'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal";

    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
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
              <Link
                key={item.name}
                to={item.path || '#'}
                onClick={() => handleMenuClick(item.path)}
                className={`flex justify-center items-center p-3 rounded-[10px]
                            transition-all duration-200 lg:h-10
                           border-none cursor-pointer font-normal
                           ${activeMenuItem === item.path 
                             ? 'bg-global-2 text-global-1' 
                             : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                           }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-4xl mx-auto">
            {/* Feed */}
            <div className="space-y-6">
              {loading && <p>Loading posts...</p>}
              {error && <p className="text-red-500">Error fetching posts: {error}</p>}
              {!loading && !error && posts.map((post) => (
                <article key={post.id} className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] bg-global-3 rounded-full">
                      <img
                        src="/images/user-avatar.png"
                        className="w-full h-full object-cover rounded-full"
                        alt="User Avatar"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal">
                        {post.profiles?.username || 'Anonymous'} •
                      </span>
                      <span className="text-global-2 text-sm sm:text-base lg:text-[24px] lg:leading-[26px] font-normal">
                        {timeAgo.format(new Date(post.created_at))}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-global-1 text-lg sm:text-xl lg:text-[24px] lg:leading-[26px] font-normal mb-2">
                      {post.title}
                    </h3>
                    <p className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px]">
                      {post.description}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4">
                    <VoteButton type="up" onClick={() => handleUpvote(post.id)} />
                    <span className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal">
                      {post.upvotes}
                    </span>
                    
                    {/* Comment Button */}
                    <ActionButton 
                      type="comment" 
                      onClick={() => toggleComments(post.id)}
                    >
                      {post.comments}
                    </ActionButton>
  
                    {/* Share Button */}
                  {/* Placeholder for share, will be fetched */}
                  {/* <ActionButton 
                    type="share" 
                    onClick={() => console.log('share')}
                  >
                    Share
                  </ActionButton> */}
                  </div>
                  {visibleComments === post.id && <CommentSection postId={post.id} user={user} />}
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
