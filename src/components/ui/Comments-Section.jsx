import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.js";
import UpVotesSection from "./Vote-Buttons.jsx";
import CommentActions from "./CommentActions.jsx";
import { incrementField, decrementField } from "../../utils/databaseHelpers.js";

const CommentSection = ({
  eventId,
  userId,
  comments: initialComments = [],
}) => {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);

  // Load comments from database when component mounts
  useEffect(() => {
    if (eventId) {
      loadComments();
    }
  }, [eventId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("EventComments")
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
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform flat comments into nested structure
      const transformedComments = transformCommentsToNested(data);
      setComments(transformedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform flat comments to nested structure
  const transformCommentsToNested = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    // First pass: create comment objects
    flatComments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        userName:
          comment.profiles?.name || comment.profiles?.username || "Anonymous",
        timeAgo: formatTimeAgo(comment.created_at),
        upvotes: comment.upvotes_count || 0,
        downvotes: comment.downvotes_count || 0,
        content: comment.content,
        replies: [],
      };
    });

    // Second pass: build nested structure
    flatComments.forEach((comment) => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return "1 week ago";
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

    return date.toLocaleDateString();
  };

  // Handle comment voting
  const handleCommentVote = async (commentId, voteType) => {
    if (!userId) {
      console.error("User must be logged in to vote");
      return;
    }

    try {
      // Check if user already voted on this comment
      const { data: existingVote, error: fetchError } = await supabase
        .from("CommentUpvotes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from("CommentUpvotes")
            .delete()
            .eq("id", existingVote.id);

          // Update comment count
          const updateField =
            voteType === "upvote" ? "upvotes_count" : "downvotes_count";
          await decrementField("EventComments", commentId, updateField);
        } else {
          // Switch vote type
          await supabase
            .from("CommentUpvotes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);

          // Update comment counts
          const oldField =
            existingVote.vote_type === "upvote"
              ? "upvotes_count"
              : "downvotes_count";
          const newField =
            voteType === "upvote" ? "upvotes_count" : "downvotes_count";

          await decrementField("EventComments", commentId, oldField);
          await incrementField("EventComments", commentId, newField);
        }
      } else {
        // Create new vote
        await supabase.from("CommentUpvotes").insert([
          {
            comment_id: commentId,
            user_id: userId,
            vote_type: voteType,
            created_at: new Date().toISOString(),
          },
        ]);

        // Update comment count
        const updateField =
          voteType === "upvote" ? "upvotes_count" : "downvotes_count";
        await incrementField("EventComments", commentId, updateField);
      }

      // Reload comments to reflect changes
      await loadComments();
    } catch (error) {
      console.error("Error handling comment vote:", error);
    }
  };

  const handleCommentUpdated = () => {
    // Reload comments to reflect changes
    loadComments();
  };

  const handleCommentDeleted = () => {
    // Reload comments to reflect changes
    loadComments();
  };

  const CommentItem = ({ comment, depth = 0 }) => (
    <div
      className={`${depth > 0 ? "ml-8 lg:ml-12 border-l border-gray-600 pl-4" : ""} mb-4 lg:mb-6`}
    >
      <div className="bg-transparent p-0">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm lg:text-[18px] font-normal">
                {comment.userName}
              </span>
              <span className="text-gray-400 text-xs lg:text-[14px]">
                {comment.timeAgo}
              </span>
            </div>
          </div>

          {/* Comment Actions */}
          <CommentActions
            commentId={comment.id}
            userId={userId}
            authorId={comment.user_id}
            content={comment.content}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>

        {/* Comment Content */}
        <div className="pl-11 lg:pl-[52px]">
          <p className="text-white text-sm lg:text-[16px] lg:leading-[20px] mb-3">
            {comment.content}
          </p>

          {/* Comment Vote Actions */}
          <div className="flex items-center gap-2 mb-4">
            <UpVotesSection
              upvotes={comment.upvotes}
              downvotes={comment.downvotes}
              eventId={comment.id}
              userId={userId}
              light={false}
              small={true}
              upvote_action={() => handleCommentVote(comment.id, "upvote")}
              downvote_action={() => handleCommentVote(comment.id, "downvote")}
            />
            <button className="text-purple-400 hover:text-purple-300 text-xs lg:text-[14px] ml-2">
              Reply
            </button>
          </div>
        </div>

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-transparent p-6">
        <p className="text-white text-center">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-6">
      <div className="bg-transparent rounded-[25px] p-0">
        <h3 className="text-white text-lg lg:text-[22px] font-normal mb-6">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
