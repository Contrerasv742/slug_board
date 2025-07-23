import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { incrementField, decrementField } from '../../utils/databaseHelpers.js';

const UpVotesSection = ({
  upvotes = 0,
  downvotes = 0, 
  eventId,
  userId, // This should be passed from auth context
  light = true,
  small = false,
  upvote_action = () => console.log('upvote'),
  downvote_action = () => console.log('downvote'),
}) => {
  const [voteState, setVoteState] = useState(null); // null, 'up', or 'down'
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  const [animateCount, setAnimateCount] = useState(false);
  const [loading, setLoading] = useState(false);

  const arrow_img = light ? "/images/vote-arrow-black.png" : "/images/vote-arrow-white.png";

  // Load existing vote on component mount
  useEffect(() => {
    if (eventId && userId) {
      loadExistingVote();
    }
  }, [eventId, userId]);

  const loadExistingVote = async () => {
    try {
      const { data, error } = await supabase
        .from('EventUpvotes')
        .select('vote_type')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading existing vote:', error);
        return;
      }

      if (data) {
        setVoteState(data.vote_type === 'upvote' ? 'up' : 'down');
      }
    } catch (error) {
      console.error('Error loading vote:', error);
    }
  };

  const handleVoteInDatabase = async (newVoteType) => {
    if (!eventId || !userId) {
      console.error('Event ID or User ID missing');
      return false;
    }

    setLoading(true);
    try {
      // Check if user already has a vote
      const { data: existingVote, error: fetchError } = await supabase
        .from('EventUpvotes')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingVote) {
        if (existingVote.vote_type === newVoteType) {
          // Remove vote if clicking the same button
          const { error: deleteError } = await supabase
            .from('EventUpvotes')
            .delete()
            .eq('id', existingVote.id);

          if (deleteError) throw deleteError;

          // Update event count
          const updateField = newVoteType === 'upvote' ? 'upvotes_count' : 'downvotes_count';
          await decrementField('Events', eventId, updateField);

          return 'removed';
        } else {
          // Update existing vote to new type
          const { error: updateError } = await supabase
            .from('EventUpvotes')
            .update({ vote_type: newVoteType, updated_at: new Date().toISOString() })
            .eq('id', existingVote.id);

          if (updateError) throw updateError;

          // Update event counts (decrement old, increment new)
          const oldField = existingVote.vote_type === 'upvote' ? 'upvotes_count' : 'downvotes_count';
          const newField = newVoteType === 'upvote' ? 'upvotes_count' : 'downvotes_count';
          
          await decrementField('Events', eventId, oldField);
          await incrementField('Events', eventId, newField);

          return 'switched';
        }
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from('EventUpvotes')
          .insert([
            {
              event_id: eventId,
              user_id: userId,
              vote_type: newVoteType,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (insertError) throw insertError;

        // Update event count
        const updateField = newVoteType === 'upvote' ? 'upvotes_count' : 'downvotes_count';
        await incrementField('Events', eventId, updateField);

        return 'added';
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getContainerBackground = () => {
    if (voteState === 'up') {
      return "bg-purple-500 shadow-purple-200 shadow-lg";
    } else if (voteState === 'down') {
      return "bg-red-500 shadow-red-200 shadow-lg";
    } else {
      return light ? "bg-global-3" : "bg-transparent";
    }
  };

  const getTextColor = () => {
    if (voteState === 'up' || voteState === 'down') {
      return "text-global-4";
    } else {
      return "text-global-1";
    }
  };
  
  const txt_size = small ? "lg:text-[16px] lg:leading-[18px]" : "lg:text-[24px] lg:leading-[26px]";
  const btn_size = small ? "lg:w-[25px] lg:h-[25px]" : "lg:w-[40px] lg:h-[40px]";
  const arrow_size = small ? "lg:w-[16px] lg:h-[16px]" : "lg:w-[20px] lg:h-[20px]";

  const handleUpvote = async () => {
    if (loading) return;

    const result = await handleVoteInDatabase('upvote');
    
    if (result === 'removed') {
      setVoteState(null);
      setCurrentUpvotes(prev => prev - 1);
    } else if (result === 'switched') {
      setVoteState('up');
      setCurrentUpvotes(prev => prev + 1);
      setCurrentDownvotes(prev => prev - 1);
    } else if (result === 'added') {
      setVoteState('up');
      setCurrentUpvotes(prev => prev + 1);
    }

    if (result) {
      setAnimateCount(true);
      setTimeout(() => setAnimateCount(false), 300);
      upvote_action();
    }
  };

  const handleDownvote = async () => {
    if (loading) return;

    const result = await handleVoteInDatabase('downvote');
    
    if (result === 'removed') {
      setVoteState(null);
      setCurrentDownvotes(prev => prev - 1);
    } else if (result === 'switched') {
      setVoteState('down');
      setCurrentDownvotes(prev => prev + 1);
      setCurrentUpvotes(prev => prev - 1);
    } else if (result === 'added') {
      setVoteState('down');
      setCurrentDownvotes(prev => prev + 1);
    }

    if (result) {
      setAnimateCount(true);
      setTimeout(() => setAnimateCount(false), 300);
      downvote_action();
    }
  };

  const getButtonClasses = (type) => {
    const baseClasses = `flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8
      ${btn_size} rounded-[10px] lg:rounded-[20px] border-none cursor-pointer
      transition-all duration-200 ease-out transform hover:scale-110 active:scale-95
      shadow-sm hover:shadow-md active:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`;

    if (type === 'up' && voteState === 'up') {
      return `${baseClasses} bg-purple-600 hover:bg-purple-700 shadow-purple-300 
              shadow-md hover:shadow-purple-400 hover:shadow-lg`;
    } else if (type === 'down' && voteState === 'down') {
      return `${baseClasses} bg-red-600 hover:bg-red-700 shadow-red-300 
              shadow-md hover:shadow-red-400 hover:shadow-lg`;
    } else {
      const containerBg = getContainerBackground();
      if (containerBg.includes('purple')) {
        return `${baseClasses} bg-purple-400 hover:bg-purple-600`;
      } else if (containerBg.includes('red')) {
        return `${baseClasses} bg-red-400 hover:bg-red-600`;
      } else {
        return `${baseClasses} bg-transparent hover:bg-global-5 
                hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]`;
      }
    }
  };

  const getArrowClasses = (type) => {
    const baseClasses = `${arrow_size} transition-all duration-200`;
    
    if (type === 'up' && voteState === 'up') {
      return `${baseClasses} brightness-0 invert scale-110`;
    } else if (type === 'down' && voteState === 'down') {
      return `${baseClasses} brightness-0 invert scale-110 rotate-180`;
    } else {
      return `${baseClasses} w-2 h-2 sm:w-4 sm:h-4 ${type === 'down' ? 'rotate-180' : ''}`;
    }
  };

  const VoteButton = ({ type, onClick }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={getButtonClasses(type)}
    >
      <img 
        src={arrow_img}
        alt={type === 'up' ? "upvote" : "downvote"}
        className={getArrowClasses(type)}
      />
    </button>
  );

  // Calculate net votes for display
  const netVotes = currentUpvotes - currentDownvotes;

  return (
    <div className={`flex items-center gap-1 lg:gap-0 p-1 lg:p-0 
        rounded-[15px] lg:rounded-[22px] shadow-sm hover:shadow-md 
        transition-all duration-300 ${getContainerBackground()}`}>
      <VoteButton
        type="up" 
        onClick={handleUpvote}
      />
      <span className={`${getTextColor()} text-xs sm:text-sm ${txt_size} font-normal px-2
                       transition-all duration-300 ${animateCount ? 'scale-125 font-bold' : ''}`}>
        {netVotes}
      </span>
      <VoteButton 
        type="down" 
        onClick={handleDownvote}
      />
    </div>
  );
};

export default UpVotesSection;
