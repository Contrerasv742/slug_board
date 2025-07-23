import { useState } from "react";
import { supabase } from "../../lib/supabase.js";
import { incrementField } from "../../utils/databaseHelpers.js";

export default function ExpandableComment({ eventId, userId, onCommentAdded }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !eventId || !userId) {
      console.error("Missing required fields for comment submission");
      return;
    }

    setLoading(true);
    try {
      // Insert new comment into database
      const { data, error } = await supabase
        .from("EventComments")
        .insert([
          {
            event_id: eventId,
            user_id: userId,
            content: newComment.trim(),
            parent_id: null, // Top-level comment
            upvotes_count: 0,
            downvotes_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select(
          `
          *,
          profiles:user_id (
            name,
            username,
            avatar_url
          )
        `,
        )
        .single();

      if (error) throw error;

      // Update event comments count
      await incrementField("Events", eventId, "comments_count");

      // Notify parent component about new comment
      if (onCommentAdded && data) {
        onCommentAdded(data);
      }

      // Reset form
      setNewComment("");
      setIsExpanded(false);

      console.log("Comment submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
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
        placeholder-gray-400 w-full min-h-[40px] py-0 px-0"
        autoFocus
        disabled={loading}
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setIsExpanded(false)}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 lg:px-8
          lg:py-3 rounded-[20px] transition-colors duration-200 text-sm
          lg:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleCommentSubmit}
          disabled={loading || !newComment.trim()}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2
          lg:px-8 lg:py-3 rounded-[20px] transition-colors duration-200 text-sm
          lg:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}
