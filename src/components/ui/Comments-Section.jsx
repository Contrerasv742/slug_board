import React from 'react';

const CommentSection = ({ comments }) => {
  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 lg:w-[25px] lg:h-[25px] 
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-transparent
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-[20px] lg:h-[20px] ${type === 'down' ? 'rotate-180' : ''}`}
      >
        <path d="M8 2L12 6H4L8 2Z" fill="white" />
      </svg>
    </button>
  );

  const CommentItem = ({ comment, depth = 0, isLast = false }) => (
    <div className="relative">
      {/* Threading lines - only show for nested comments */}
      {depth > 0 && (
        <>
          {/* Main vertical line that extends from way above to way below */}
          <div className="absolute -top-16 lg:-top-20 left-0 lg:left-[13.5px] z-0">
            <div className={`w-[1px] bg-gray-600 ${
              isLast 
                ? 'h-20 lg:h-24' // Only go to the curve area for last item
                : 'h-[calc(100%+120px)] lg:h-[calc(100%+140px)]' // Continue through all children and their content
            }`}></div>
          </div>
          
          {/* Horizontal connector line with curve that connects to child pfp */}
          <div className="absolute top-0 lg:top-0 left-0 lg:left-4 z-0">
            <svg 
              width="40" 
              height="20" 
              className="overflow-visible"
              viewBox="0 0 40 20"
            >
              <path
                d="M 0 0 L 0 12 Q 0 16 4 16 L 26 16"
                stroke="rgb(75, 85, 99)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </>
      )}
      
      {/* Comment content */}
      <div className={`${depth > 0 ? 'ml-10 lg:ml-12' : ''} mb-4 lg:mb-6 group relative z-10`}>
        <div className="bg-transparent rounded-[20px] p-0 lg:p-0">
          {/* Comment Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br
              from-blue-400 to-purple-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-global-4 text-sm lg:text-[18px] font-normal">
                {comment.userName}
              </span>
              <span className="text-gray-400 text-xs lg:text-[14px]">
                {comment.timeAgo}
              </span>
            </div>
          </div>

          {/* Comment Content - padded to align with vote buttons */}
          <div className="pl-11 lg:pl-[52px]">
            <p className="text-global-4 text-sm lg:text-[16px] lg:leading-[20px] mb-3">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-transparent rounded-[10px] px-2 py-1">
                <VoteButton type="up" onClick={() => console.log('upvote comment')} />
                <span className="text-global-4 text-xs lg:text-[14px] px-1">
                  {comment.upvotes}
                </span>
                <VoteButton type="down" onClick={() => console.log('downvote comment')} />
              </div>
              <button className="text-purple-400 hover:text-purple-300 text-xs lg:text-[14px]">
                Reply
              </button>
            </div>
          </div>

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply, index) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  depth={depth + 1}
                  isLast={index === comment.replies.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );



  return (
    <div className="bg-transparent rounded-[25px] p-0 lg:p-0">
      <h3 className="text-global-4 text-lg lg:text-[22px] font-normal mb-6">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4 lg:space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
