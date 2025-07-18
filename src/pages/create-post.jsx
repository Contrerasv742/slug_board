import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import '../styles/home.css';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const CreatePostPage = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById('image-upload-input').click();
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

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
                  lg:w-[40px] lg:h-[40px] rounded-[10px] lg:rounded-[20px] border-none
                  cursor-pointer bg-global-3 hover:bg-global-5 transition-colors ${className}`}
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
          className={`${baseClasses} bg-global-3 hover:bg-global-5 w-10 h-8
                      sm:w-12 sm:h-10 lg:w-[50px] lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1
                      lg:p-[3px] ${className}`}
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
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName={user?.email || "John Doe"}
        userHandle={`@${user?.email?.split('@')[0] || 'johndoe'}`}
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Page */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_48px] flex
          justify-center">
          <div className="flex flex-col gap-[20px] lg:gap-[20px] w-[95%]
            sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">

            {/* Page Information */}
            <div className="mb-0 lg:mb-0 text-center">
              <div className="inline-block px-4 py-2 rounded-[40px] mb-3
                lg:mb-2 bg-gradient-to-br from-white/[0.15] to-white/[0.05]
                border border-white/[0.18]
                shadow-[0_8px_32px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]
                hover:from-white/[0.18] hover:to-white/[0.08]
                hover:border-white/[0.25]
                hover:shadow-[0_12px_40px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
                transition-all duration-300 ease-out relative overflow-hidden
                before:absolute before:inset-0 before:rounded-[40px]
                before:bg-gradient-to-br before:from-white/[0.08]
                before:to-transparent before:opacity-0 before:hover:opacity-100
                before:transition-opacity before:duration-300">
                <h1 className="text-[rgba(147,122,250,0.9)] text-2xl
                  sm:text-3xl lg:text-[38px] lg:leading-tight font-light
                  drop-shadow-lg relative z-10">
                  Create a post below
                </h1>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2
                  rounded-full bg-gradient-to-br from-white/[0.12]
                  to-white/[0.04] border border-white/[0.15]
                  shadow-[0_6px_24px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:from-white/[0.15] hover:to-white/[0.06]
                  hover:border-white/[0.20]
                  hover:shadow-[0_8px_32px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.25)]
                  transition-all duration-300 ease-out relative overflow-hidden
                  before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-br before:from-white/[0.06]
                  before:to-transparent before:opacity-0
                  before:hover:opacity-100 before:transition-opacity
                  before:duration-300">
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                  <p className="text-white/70 text-sm lg:text-base
                    drop-shadow-md relative z-10">
                    Fill in all required information
                  </p>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <article className="bg-global-2 rounded-[35px] p-3
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
                    {user?.email || 'User Name'} •
                  </span>
                  <span className="text-global-2 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal">
                    1 sec ago
                  </span>
                </div>
              </div>

              {/* Post Title Input */}
              <div className="mb-2 lg:mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-base sm:text-lg
                    lg:text-[32px] lg:leading-[36px] font-normal">
                    Post Title
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Enter your post title here..."
                  className="w-full bg-global-2 text-global-1 text-base
                  sm:text-lg lg:text-[32px] lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500 shadow-transparent"
                />
              </div>

              {/* Post Description Input */}
              <div className="mb-3 lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-global-1 text-sm sm:text-base
                    lg:text-lg lg:leading-[36px] font-normal">
                    Post Description
                  </span>
                  <span className="w-2 h-2 bg-purple-400/80 rounded-full
                    animate-pulse shadow-[0_0_8px_rgba(147,122,250,0.6)]
                    relative z-10"></span>
                </div>
                <input
                  type="text"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Describe your post..."
                  className="w-full bg-transparent text-global-1 text-sm
                  sm:text-base lg:text-lg lg:leading-[36px] font-normal
                  border-none outline-none placeholder-gray-400
                  focus:placeholder-gray-500"
                />
              </div>

              {/* Image Upload Section */}
              <div className="mb-3 lg:mb-[20px]">
                <input
                  type="file"
                  id="image-upload-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={handleImageClick}
                  className="w-full h-32 sm:h-40 lg:h-[320px] bg-global-5
                    rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] border-4 
                    border-dashed border-[#8a2be292] hover:border-[#9a3bf2] 
                    hover:bg-opacity-80 transition-all duration-300 ease-in-out
                    cursor-pointer group relative overflow-hidden"
                >
                  {imagePreview ? (
                    <div className="w-full h-full relative">
                      <img 
                        src={imagePreview}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-[16px]
                        sm:rounded-[21px] lg:rounded-[31px] group-hover:opacity-80
                        transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 
                        group-hover:bg-opacity-20 transition-all duration-300
                        rounded-[16px] sm:rounded-[21px] lg:rounded-[31px]
                        flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 text-white text-sm
                          sm:text-base lg:text-lg font-medium bg-black bg-opacity-50
                          px-4 py-2 rounded-full">
                          Click to change image
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center 
                      justify-center text-gray-400 group-hover:text-gray-300
                      transition-colors duration-300">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-2
                        group-hover:scale-110 transition-transform duration-300">
                        📷
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-medium
                        group-hover:scale-105 transition-transform duration-300">
                        Click to add an image
                      </div>
                      <div className="text-xs sm:text-sm lg:text-base mt-1
                        opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                        Supports JPG, PNG, GIF
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px]
                flex-wrap">
                {/* Upvote Section */}
                <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0
                  bg-global-3 rounded-[15px] lg:rounded-[22px]">
                  <VoteButton type="up" onClick={() => console.log('upvote')} />
                  <span className="text-global-1 text-xs sm:text-sm
                    lg:text-[24px] lg:leading-[26px] font-normal px-2">
                    0 
                  </span>
                  <VoteButton type="down" onClick={() => console.log('downvote')} />
                </div>

                {/* Comment Button */}
                <ActionButton 
                  type="comment" 
                  onClick={() => console.log('comment')}
                />

                {/* Post Event Button */}
                <ActionButton 
                  type="post-event" 
                  onClick={handlePostSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Event'}
                </ActionButton>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
