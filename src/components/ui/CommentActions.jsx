import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const CommentActions = ({ commentId, userId, authorId, content, onCommentUpdated, onCommentDeleted }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [loading, setLoading] = useState(false);

  // Only show actions if user owns the comment
  if (!userId || userId !== authorId) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('EventComments')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;

      // Notify parent component
      if (onCommentUpdated) {
        onCommentUpdated(data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setLoading(true);
    try {
      // Delete comment votes first
      await supabase
        .from('CommentUpvotes')
        .delete()
        .eq('comment_id', commentId);

      // Delete the comment
      const { error } = await supabase
        .from('EventComments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Notify parent component
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };

  if (isEditing) {
    return (
      <div className="mt-2">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-[10px] bg-global-2 text-white text-sm resize-none"
          rows="3"
          disabled={loading}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleCancelEdit}
            disabled={loading}
            className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-[10px] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={loading || !editContent.trim()}
            className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-[10px] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loading}
        className="p-1 hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-[10px] shadow-xl border z-50">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 
                hover:bg-gray-100 transition-colors duration-150 first:rounded-t-[10px]"
            >
              Edit
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 
                hover:bg-red-50 transition-colors duration-150 rounded-b-[10px]"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default CommentActions; 