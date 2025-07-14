import { useState } from 'react';

export default function ExpandableComment() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log('Comment submitted:', newComment);
      // Handle comment submission logic here
      setNewComment('');
      setIsExpanded(false); // Optionally collapse after submission
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  if (!isExpanded) {
    // Collapsed state - shows the simple version
    return (
      <div className="bg-white/10 rounded-[25px] p-0 lg:p-0 mb-6 border-white border-solid border"> 
        <textarea
          className="text-gray-800 text-lg pl-4 lg:text-[22px] font-normal
          bg-transparent border-none outline-none resize-none
          placeholder-gray-400 w-full min-h-[40px] py-2 cursor-pointer"
          onClick={handleExpand}
          onFocus={handleExpand}
          placeholder="Add a comment"
          rows="1"
          readOnly
        />
      </div>
    );
  }

  // Expanded state - shows the full version with submit button
  return (
    <div className="bg-white/10 rounded-[25px] p-4 lg:p-4 mb-6 mx-0 border-white border-solid border">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="What are your thoughts?"
        className="text-gray-800 text-lg lg:text-[22px] font-normal
        bg-transparent border-none outline-none resize-none
        placeholder-gray-400 w-full min-h-[40px] py-0 px-0" autoFocus
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setIsExpanded(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 lg:px-8
          lg:py-3 rounded-[20px] transition-colors duration-200 text-sm
          lg:text-[16px]"
        >
          Cancel
        </button>
        <button
          onClick={handleCommentSubmit}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2
          lg:px-8 lg:py-3 rounded-[20px] transition-colors duration-200 text-sm
          lg:text-[16px]"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
