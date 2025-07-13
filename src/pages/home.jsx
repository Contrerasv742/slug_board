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
    { name: 'Explore', active: false },
    { name: 'Popular', active: false }
  ];

  // The hardcoded feedPosts array is removed. We will use the 'posts' state.

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
        alt={type === 'up' ? "upvote" : "downvote"}
        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[30px] ${type ===
'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center border-none \
      cursor-pointer bg-global-3 hover:bg-global-5 transition-colors";
    
    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px]
                      lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1
                      lg:p-[3px]
                      ${className}`}
        >
          <img 
            src="/images/img_speech_bubble.png"
            alt="comments"
            className="w-5 h-4 sm:w-6 sm:h-5 lg:w-[30px] lg:h-[30px]"
          />
        </button>
      );
    }
    
    if (type === 'share') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3
                      lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px]
                    ${className}`
          }
          >
          <img 
            src="/images/share_arrow.png"
            alt="share"
            className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[32px]"
          />
          <span className="text-global-1 text-xs sm:text-sm lg:text-[24px]
            lg:leading-[26px] font-normal">
            {children}
          </span>
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Homepage Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60
        p-4 sm:p-6 lg:p-[16px_32px]">
        <div className="flex flex-row items-center justify-between w-full
          max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">

          {/* Logo Section - Matching Login Style */}
          <div className="flex flex-row items-center justify-start
            flex-shrink-0">
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
          </div>

          {/* Search Bar */}
          <div className="pl-[40px] w-[800px] max-w-[650px] header-search">
            <SearchView
              placeholder="Search Posts"
              value={searchValue}
              onChange={handleSearchChange}
              leftIcon="/images/img_search.png"
              className="text-sm sm:text-base md:text-lg lg:text-xl
              lg:leading-[10px] py-[2px] sm:py-[4px] lg:py-[2px] lg:pl-[45px] w-full h-[40px]"
            />
          </div>

          <div className="flex-1"></div>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2
          border-white border-opacity-60 p-5">
          <nav className="flex flex-col gap-6 lg:gap-[2px] w-full">
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
                <span className="text-lg lg:text-3xl lg:leading-[38px]">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button className="block lg:hidden fixed top-4 left-4 z-50 p-3
          bg-global-1 rounded-lg border border-white border-opacity-60
          cursor-pointer">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1 mb-1"></span>
            <span className="block w-5 h-0.5 bg-sidebar-1"></span>
          </div>
        </button>

        {/* Feed Content - Centered and Smaller */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex
          justify-center">
          <div className="flex flex-col gap-4 lg:gap-[32px] w-[95%] sm:w-[85%]
            lg:w-[80%] max-w-[800px] mx-auto">
            {loading && <p>Loading posts...</p>}
            {error && <p className="text-red-500">Error fetching posts: {error}</p>}
            {!loading && !error && posts.map((post) => (
              <article key={post.id} className="bg-global-2 rounded-[35px] p-3
                sm:p-4 lg:p-[24px] w-full">
                {/* Post Header */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3
                  lg:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[56px]
                    lg:h-[56px] bg-global-4 rounded-full flex-shrink-0"></div>
                  <div className="flex items-center gap-2 sm:gap-2
                    lg:gap-[12px] flex-wrap">
                    <span className="text-global-1 text-sm sm:text-base
                      lg:text-[24px] lg:leading-[26px] font-normal">
                      {post.profiles?.username || 'Anonymous'} •
                    </span>
                    <span className="text-global-2 text-sm sm:text-base
                      lg:text-[24px] lg:leading-[26px] font-normal">
                      {timeAgo.format(new Date(post.created_at))}
                    </span>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-global-1 text-base sm:text-lg
                  lg:text-[32px] lg:leading-[36px] font-normal mb-0
                  lg:mb-[0px]">
                  {post.title}
                </h2>

                {/* Post Description */}
                <h4 className="text-global-1 text-sm sm:text-base lg:text-lg
                  lg:leading-[36px] font-normal mb-0 lg:mb-[0px]">
                  {post.description}
                </h4>

                {/* Post Content Area - Reduced Height */}
                <div className="w-full h-32 sm:h-40 lg:h-[320px] bg-global-5
                  rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-3
                  lg:mb-[20px]">
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                  flex-wrap">
                  {/* Upvote Section */}
                  <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0
                    bg-global-3 rounded-[15px] lg:rounded-[22px]">
                    <VoteButton type="up" onClick={() => handleUpvote(post.id)} />
                    <span className="text-global-1 text-xs sm:text-sm
                      lg:text-[24px] lg:leading-[26px] font-normal px-2">
                      {post.upvotes}
                    </span>
                    <VoteButton type="down" onClick={() => console.log('downvote')} />
                  </div>

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
        </main>
      </div>

      {/* Create Events */}
      <button
        onClick={() => console.log('Add events button clicked!')}
        className="fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full 
        bg-global-2 hover:bg-global-3 transition-all duration-200 
        shadow-lg hover:shadow-xl transform hover:scale-105
        flex items-center justify-center z-50"
      >
        <span className="text-5xl font-bold leading-none text-starship-animated">
          +
        </span>
      </button>
    </div>
  );
};

export default HomePage;
