import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import ExpandableComment from '../components/ui/Add-Comment.jsx';
import CommentSection from '../components/ui/Comments-Section.jsx';

const PostDetailPage = () => {
  const [newComment, setNewComment] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState(''); 
  const [comments, setComments] = useState([
    {
      id: 1,
      userName: 'Alex Chen',
      timeAgo: '3 hours ago',
      content: 'This looks amazing! Thanks for sharing the details about the meetup location.',
      upvotes: 12,
      replies: [
        {
          id: 11,
          userName: 'Jamie Silva',
          timeAgo: '2 hours ago',
          content: 'Glad you like it! See you there 📸',
          upvotes: 5,
          replies: [
            {
              id: 11,
              userName: 'Jamie Silva',
              timeAgo: '2 hours ago',
              content: 'Glad you like it! See you there 📸',
              upvotes: 5,
              replies: []
            },
          ]
        },
        {
          id: 11,
          userName: 'Jamie Silva',
          timeAgo: '2 hours ago',
          content: 'Glad you like it! See you there 📸',
          upvotes: 5,
          replies: []
        },
      ]
    },
    {
      id: 2,
      userName: 'Sarah Martinez',
      timeAgo: '2 hours ago',
      content: 'Perfect timing! I\'ve been wanting to improve my sunset photography skills.',
      upvotes: 8,
      replies: [
        {
          id: 11,
          userName: 'Jamie Silva',
          timeAgo: '2 hours ago',
          content: 'Glad you like it! See you there 📸',
          upvotes: 5,
          replies: []
        },
        {
          id: 11,
          userName: 'Jamie Silva',
          timeAgo: '2 hours ago',
          content: 'Glad you like it! See you there 📸',
          upvotes: 5,
          replies: []
        },
      ]
    },
    {
      id: 3,
      userName: 'Mike Johnson',
      timeAgo: '1 hour ago',
      content: 'Count me in! Should we bring our own equipment or will there be some available?',
      upvotes: 3,
      replies: []
    }
  ]);

  const post = {
    id: 1,
    userName: 'Jamie Silva',
    timeAgo: '2 days ago',
    title: 'Photography Club Meetup - Sunset Photo Walk',
    description: 'Join us for a spectacular sunset photo walk around campus! We\'ll be exploring the best spots for golden hour photography, sharing tips and techniques, and connecting with fellow photography enthusiasts. Perfect for all skill levels - bring your camera and let\'s capture some amazing shots together!',
    upvotes: 124,
    downvotes: 3,
    totalComments: comments.length,
    imageUrl: '/images/sunset-campus.jpg'
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        userName: 'Current User',
        timeAgo: 'now',
        content: newComment,
        upvotes: 0,
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 lg:w-[25px] lg:h-[25px] 
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-transparent
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src="/images/vote-arrow-white.png"
        alt={type === 'up' ? "upvote" : "downvote"}
        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[20px] lg:h-[20px] ${type === 'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center border-none cursor-pointer bg-global-3 hover:bg-global-5 transition-colors";
    
    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} w-10 h-8 sm:w-12 sm:h-10 lg:w-[50px] lg:h-[40px] rounded-[15px] lg:rounded-[20px] p-1 lg:p-[3px] ${className}`}
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
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] ${className}`}
        >
          <img 
            src="/images/share_arrow.png"
            alt="share"
            className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[32px]"
          />
          <span className="text-global-1 text-xs sm:text-sm lg:text-[24px] lg:leading-[26px] font-normal">
            {children}
          </span>
        </button>
      );
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName="John Doe"
        userHandle="@johndoe"
        userAvatar="/images/default-avatar.png"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          activeMenuItem={activeMenuItem}
          onMenuClick={handleMenuClick}
        />

        {/* Post Detail Content */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <div className="w-[95%] sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">
            
            {/* Back Button */}
            <button className="flex items-center gap-2 text-global-4
              hover:text-purple-400 mb-6 transition-colors">
              <img 
                src="/images/vote-arrow-white.png"
                alt="back"
                className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4"
              />
              <span className="text-sm lg:text-[18px]">Back to Posts</span>
            </button>

            {/* Main Post */}
            <article className="bg-global-2 rounded-[35px] p-3 sm:p-4 lg:p-[24px] w-full mb-6">
              {/* Post Header */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 lg:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[56px] lg:h-[56px] bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex items-center gap-2 sm:gap-2 lg:gap-[12px] flex-wrap">
                  <span className="text-global-1 text-sm sm:text-base lg:text-[24px] lg:leading-[26px] font-normal">
                    {post.userName} •
                  </span>
                  <span className="text-global-2 text-sm sm:text-base
                    lg:text-[24px] lg:leading-[26px] font-normal">
                    {post.timeAgo}
                  </span>
                </div>
              </div>

              {/* Post Title */}
              <h1 className="text-global-1 text-lg sm:text-xl lg:text-[32px]
                lg:leading-[36px] font-normal mb-3 lg:mb-4">
                {post.title}
              </h1>

              {/* Post Description */}
              <p className="text-global-1 text-sm sm:text-base lg:text-[18px]
                lg:leading-[24px] font-normal mb-4 lg:mb-6">
                {post.description}
              </p>

              {/* Post Image */}
              <div className="w-full h-64 sm:h-80 lg:h-[400px]
                bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600
                rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-4 lg:mb-6
                flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl lg:text-6xl mb-2">🌅</div>
                  <div className="text-sm lg:text-lg">Sunset Photo Walk Image</div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px] flex-wrap">
                {/* Upvote Section */}
                <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0
                  bg-transparent"> 
                  <VoteButton type="up" onClick={() => console.log('upvote')} />
                  <span className="text-global-1 text-xs sm:text-sm
                    lg:text-[24px] lg:leading-[26px] font-normal px-2">
                    {post.upvotes}
                  </span>
                  <VoteButton type="down" onClick={() => console.log('downvote')} />
                </div>

                {/* Comment Count */}
                <div className="flex items-center gap-2 px-3 py-2 bg-global-3
                  rounded-[15px] lg:rounded-[22px]">
                  <img 
                    src="/images/img_speech_bubble.png"
                    alt="comments"
                    className="w-4 h-4 lg:w-[24px] lg:h-[24px]"
                  />
                  <span className="text-global-1 text-xs sm:text-sm lg:text-[20px] font-normal">
                    {post.totalComments} comments
                  </span>
                </div>

                {/* Share Button */}
                <ActionButton 
                  type="share" 
                  onClick={() => console.log('share')}
                >
                  Share
                </ActionButton>
              </div>
            </article>

            {/* Comment Form */}
            <ExpandableComment 
              newComment={newComment}
              setNewComment={setNewComment}
              onCommentSubmit={handleCommentSubmit}
            />

            {/* Comments Section */}
            <CommentSection comments={comments} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostDetailPage;
