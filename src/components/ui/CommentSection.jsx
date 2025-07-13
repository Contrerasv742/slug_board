import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Button from './Button';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const CommentSection = ({ postId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    profiles (
                        username
                    )
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            setComments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!user) {
            setError("You must be logged in to comment.");
            return;
        }
        if (newComment.trim().split(' ').length > 100) {
            setError("Comment cannot exceed 100 words.");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from('comments')
                .insert([{ post_id: postId, user_id: user.id, content: newComment }]);
            if (error) throw error;
            setNewComment('');
            fetchComments();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold text-global-1">Comments</h3>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-2">
                <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    className="w-full p-2 rounded bg-global-3 text-global-1"
                    rows="3"
                ></textarea>
                <Button onClick={handleCommentSubmit} disabled={loading} className="mt-2">
                    {loading ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
            <div className="mt-4 space-y-4">
                {loading && <p>Loading comments...</p>}
                {comments.map(comment => (
                    <div key={comment.id} className="bg-global-3 p-3 rounded">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-global-1">{comment.profiles.username || 'Anonymous'}</span>
                            <span className="text-xs text-global-2">{timeAgo.format(new Date(comment.created_at))}</span>
                        </div>
                        <p className="text-global-1 mt-1">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection; 