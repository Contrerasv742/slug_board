import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';

const PostDetailPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [newComment, setNewComment] = useState('');
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
          upvotes: 5
        }
      ]
    },
    {
      id: 2,
      userName: 'Sarah Martinez',
      timeAgo: '2 hours ago',
      content: 'Perfect timing! I\'ve been wanting to improve my sunset photography skills.',
      upvotes: 8,
      replies: []
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

  const menuItems = [
    { name: 'Home', active: false },
    { name: 'Map', active: false },
    { name: 'Explore', active: false },
    { name: 'Popular', active: false }
  ];

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 lg:w-[40px] lg:h-[40px] 
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-global-3 
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src="/images/img_arrow.png"
        alt={type === 'up' ? "upvote" : "downvote"}
        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[32px] lg:h-[30px] ${type === 'down' ? 'rotate-180' : ''}`}
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
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2 border-white border-opacity-60 p-5">
          <nav className="flex flex-col gap-6 lg:gap-[2px] w-full">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex justify-center items-center p-3 rounded-[10px] transition-all duration-200 lg:h-10 border-none cursor-pointer font-normal
                ${activeMenuItem === item.name 
                  ? 'bg-global-2 text-global-1' 
                  : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                }`}
              >
                <span className="text-lg lg:text-3xl lg:leading-[38px]">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Post Detail Content */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px] flex justify-center">
          <div className="w-[95%] sm:w-[85%] lg:w-[80%] max-w-[800px] mx-auto">
            
            {/* Back Button */}
            <button className="flex items-center gap-2 text-global-4 hover:text-purple-400 mb-6 transition-colors">
              <img 
                src="/images/img_arrow.png"
                alt="back"
                className="w-4 h-4 rotate-90"
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
                  <span className="text-global-2 text-sm sm:text-base lg:text-[24px] lg:leading-[26px] font-normal">
                    {post.timeAgo}
                  </span>
                </div>
              </div>

              {/* Post Title */}
              <h1 className="text-global-1 text-lg sm:text-xl lg:text-[32px] lg:leading-[36px] font-normal mb-3 lg:mb-4">
                {post.title}
              </h1>

              {/* Post Description */}
              <p className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[24px] font-normal mb-4 lg:mb-6">
                {post.description}
              </p>

              {/* Post Image */}
              <div className="w-full h-64 sm:h-80 lg:h-[400px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-[20px] sm:rounded-[25px] lg:rounded-[35px] mb-4 lg:mb-6 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl lg:text-6xl mb-2">🌅</div>
                  <div className="text-sm lg:text-lg">Sunset Photo Walk Image</div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-[12px] flex-wrap">
                {/* Upvote Section */}
                <div className="flex items-center gap-1 lg:gap-0 p-1 lg:p-0 bg-global-3 rounded-[15px] lg:rounded-[22px]">
                  <VoteButton type="up" onClick={() => console.log('upvote')} />
                  <span className="text-global-1 text-xs sm:text-sm lg:text-[24px] lg:leading-[26px] font-normal px-2">
                    {post.upvotes}
                  </span>
                  <VoteButton type="down" onClick={() => console.log('downvote')} />
                </div>

                {/* Comment Count */}
                <div className="flex items-center gap-2 px-3 py-2 bg-global-3 rounded-[15px] lg:rounded-[22px]">
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
            <div className="bg-global-2 rounded-[25px] p-4 lg:p-6 mb-6">
              <h3 className="text-global-1 text-lg lg:text-[22px] font-normal mb-4">Add a comment</h3>
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full h-24 lg:h-32 bg-global-3 text-global-1 rounded-[15px] p-3 lg:p-4 border-none outline-none resize-none text-sm lg:text-[16px] placeholder-gray-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleCommentSubmit}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-[20px] transition-colors duration-200 text-sm lg:text-[16px]"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-global-2 rounded-[25px] p-4 lg:p-6">
              <h3 className="text-global-1 text-lg lg:text-[22px] font-normal mb-6">
                Comments ({comments.length})
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-global-3 rounded-[20px] p-4 lg:p-5">
                    {/* Comment Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-global-1 text-sm lg:text-[18px] font-normal">
                          {comment.userName}
                        </span>
                        <span className="text-gray-400 text-xs lg:text-[14px]">
                          {comment.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p className="text-global-1 text-sm lg:text-[16px] lg:leading-[20px] mb-3">
                      {comment.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-global-2 rounded-[10px] px-2 py-1">
                        <VoteButton type="up" onClick={() => console.log('upvote comment')} />
                        <span className="text-global-1 text-xs lg:text-[14px] px-1">
                          {comment.upvotes}
                        </span>
                        <VoteButton type="down" onClick={() => console.log('downvote comment')} />
                      </div>
                      <button className="text-purple-400 hover:text-purple-300 text-xs lg:text-[14px]">
                        Reply
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-4 lg:ml-6 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-global-2 rounded-[15px] p-3 lg:p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                              <span className="text-global-1 text-xs lg:text-[16px] font-normal">
                                {reply.userName}
                              </span>
                              <span className="text-gray-400 text-xs lg:text-[12px]">
                                {reply.timeAgo}
                              </span>
                            </div>
                            <p className="text-global-1 text-xs lg:text-[14px] mb-2">
                              {reply.content}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-1 bg-global-3 rounded-[8px] px-2 py-1">
                                <span className="text-global-1 text-xs">↑</span>
                                <span className="text-global-1 text-xs">{reply.upvotes}</span>
                                <span className="text-global-1 text-xs">↓</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostDetailPage;
