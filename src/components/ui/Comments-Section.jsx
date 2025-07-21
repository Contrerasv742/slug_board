import React, { useRef, useEffect, useState } from 'react';
import UpVotesSection from './Vote-Buttons.jsx';

const CommentSection = ({ comments }) => {

  const CollapseButton = ({ isCollapsed, onClick, hasReplies }) => {
    if (!hasReplies) return null;
    
    return (
      <button
        onClick={onClick}
        className="absolute left-0 lg:left-[17.5px] w-4 h-4 lg:w-5 lg:h-5
        bg-transparent border-white border-solid border-[0.5px] hover:bg-gray-600 rounded-full flex items-center
        justify-center transition-colors z-20 transform -translate-x-1/2
        -translate-y-1/2" style={{ top: '54px' }}
      >
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 10 10" 
          className="w-2.5 h-2.5 lg:w-3 lg:h-3"
        >
          {isCollapsed ? (
            // Plus sign
            <>
              <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            // Minus sign
            <path d="M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>
    );
  };

  const CommentItem = ({ comment, depth = 0, isLast = false, parentRef = null }) => {
    const commentRef = useRef(null);
    const [lineHeight, setLineHeight] = useState(0);
    const [shouldShowLine, setShouldShowLine] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const hasReplies = comment.replies && comment.replies.length > 0;

    useEffect(() => {
      if (depth > 0 && commentRef.current && parentRef?.current) {
        const updateLineHeight = () => {
          const commentRect = commentRef.current.getBoundingClientRect();
          const parentRect = parentRef.current.getBoundingClientRect();
          
          // Calculate the height needed for the vertical line
          const height = commentRect.top - parentRect.top;
          setLineHeight(height);
          setShouldShowLine(true);
        };

        // Initial calculation
        updateLineHeight();

        // Recalculate on window resize
        window.addEventListener('resize', updateLineHeight);
        
        // Use ResizeObserver for content changes
        const resizeObserver = new ResizeObserver(updateLineHeight);
        if (commentRef.current) {
          resizeObserver.observe(commentRef.current);
        }
        if (parentRef.current) {
          resizeObserver.observe(parentRef.current);
        }

        return () => {
          window.removeEventListener('resize', updateLineHeight);
          resizeObserver.disconnect();
        };
      }
    }, [depth, parentRef]);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
      <div className="relative" ref={commentRef}>
        {/* Threading lines - only show for nested comments */}
        {depth > 0 && shouldShowLine && (
          <>
            {/* Dynamic vertical line */}
            <div 
              className="absolute left-0 lg:left-[17px] z-0 threading-line"
              style={{
                top: `-${lineHeight - 35}px`,
                height: isLast ? `${lineHeight - 27}px` : `${lineHeight}px`,
                width: '1px',
                backgroundColor: 'rgb(75, 85, 99)',
                transition: 'all 0.2s ease'
              }}
            />
            
            {/* Horizontal connector line with curve */}
            <div className="absolute top-0 lg:top-0 left-[1px] lg:-left-[1px] z-0">
              <svg 
                width="40" 
                height="20" 
                className="overflow-visible"
                viewBox="0 0 40 20"
              >
                <path
                  className="threading-path"
                  d="M 18.5 0 L 18.5 12 C 18.5 16 22.5 16 27.5 16 L 45 16"
                  stroke="rgb(75, 85, 99)"
                  strokeWidth="1"
                  fill="none"
                  style={{ transition: 'all 0.2s ease' }}
                />
              </svg>
            </div>
          </>
        )}
        
        {/* Collapse/Expand button - positioned on the vertical line */}
        {depth === 0 && (
          <CollapseButton 
            isCollapsed={isCollapsed} 
            onClick={toggleCollapse} 
            hasReplies={hasReplies}
          />
        )}
        
        {/* Comment content */}
        <div className={`${depth > 0 ? 'ml-10 lg:ml-12' : ''} mb-4 lg:mb-6 group relative z-10 hover-trigger`}>
          <div className="bg-transparent rounded-[20px] p-0 lg:p-0">
            {/* Comment Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br
                from-blue-400 to-purple-500 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm lg:text-[18px] font-normal">
                  {comment.userName}
                </span>
                <span className="text-gray-400 text-xs lg:text-[14px]">
                  {comment.timeAgo}
                </span>
              </div>
            </div>

            {/* Comment Content - padded to align with vote buttons */}
            <div className="pl-11 lg:pl-[52px]">
              <p className="text-white text-sm lg:text-[16px] lg:leading-[20px] mb-3">
                {comment.content}
              </p>

              {/* Comment Actions */}
              <div className="flex items-center gap-2 mb-4">
                <UpVotesSection
                  upvotes={comment.upvotes}
                  light={false}
                  small={true}
                />
                <button className="text-purple-400 hover:text-purple-300 text-xs lg:text-[14px]">
                  Reply
                </button>
              </div>
            </div>

            {/* Nested replies */}
            {hasReplies && !isCollapsed && (
              <div className="mt-2">
                {comment.replies.map((reply, index) => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    depth={depth + 1}
                    isLast={index === comment.replies.length - 1}
                    parentRef={commentRef}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-transparent min-h-screen p-6">
      <style>{`
        .hover-trigger:hover .threading-line {
          background-color: white !important;
          width: 1px !important;
        }
        
        .hover-trigger:hover .threading-path {
          stroke: white !important;
          stroke-width: 1 !important;
        }
      `}</style>
      
      <div className="bg-transparent rounded-[25px] p-0 lg:p-0">
        <h3 className="text-white text-lg lg:text-[22px] font-normal mb-6">
          Comments ({comments.length})
        </h3>

        <div className="space-y-4 lg:space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
