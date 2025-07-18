import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import '../styles/home.css'
import { supabase } from '../supabaseClient';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import CommentSection from '../components/ui/CommentSection';
import { useAuth } from '../contexts/AuthContext';
import { EventService } from '../services/eventService';

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [visibleComments, setVisibleComments] = useState(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
    fetchEvents();
  }, []);

  // Handle search when searchValue changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        handleSearch();
      } else {
        fetchEvents();
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events...');
      const { data, error } = await EventService.getAllEvents();
      
      if (error) {
        console.error('Error from EventService:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      console.log('Number of events:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample event:', data[0]);
      }
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!user) {
      setError("You must be logged in to RSVP.");
      return;
    }
    try {
      const { error } = await EventService.rsvpToEvent(user.id, eventId);
      if (error) throw error;

      // Refresh events to show new RSVP count
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleComments = (eventId) => {
    if (visibleComments === eventId) {
      setVisibleComments(null);
    } else {
      setVisibleComments(eventId);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchEvents();
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await EventService.searchEvents(searchValue);
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const VoteButton = ({ type, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 lg:w-[40px] lg:h-[40px] 
                  rounded-[10px] lg:rounded-[20px] border-none cursor-pointer bg-global-3 
                  hover:bg-global-5 transition-colors ${className}`}
    >
      <img 
        src={type === 'up' ? '/images/img_arrow.png' : '/images/img_arrow.png'} 
        alt={type === 'up' ? 'upvote' : 'downvote'}
        className={`w-4 h-4 lg:w-5 lg:h-5 ${type === 'down' ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const ActionButton = ({ type, onClick, children, className = "" }) => {
    const baseClasses = "flex justify-center items-center text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal";

    if (type === 'comment') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img 
            src="/images/img_speech_bubble.png" 
            alt="comment" 
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    if (type === 'share') {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} gap-1 lg:gap-[4px] px-2 py-2 sm:px-3 lg:px-4 lg:py-[3px] rounded-[15px] lg:rounded-[22px] bg-global-3 hover:bg-global-5 ${className}`}
        >
          <img 
            src="/images/share_arrow.png" 
            alt="share" 
            className="w-4 h-4 lg:w-5 lg:h-5"
          />
          {children}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-global-1">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search events..."
        userName={user?.email || "John Doe"}
        userHandle={`@${user?.email?.split('@')[0] || 'johndoe'}`}
        userAvatar="/images/default-avatar.png"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Page */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-4xl mx-auto">
            {/* Events Feed */}
            <div className="space-y-6">
          {loading && <p className="text-global-1 text-center">Loading events...</p>}
          {error && <p className="text-red-500 text-center">Error fetching events: {error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className="text-global-1 text-center">No events found. Create the first event!</p>
          )}
          {!loading && !error && events.map((event) => (
            <article key={event.id} className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
              {/* Event Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] bg-global-3 rounded-full">
                  <img
                    src="/images/user-avatar.png"
                    className="w-full h-full object-cover rounded-full"
                    alt="User Avatar"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] font-normal">
                    {event.users?.full_name || event.users?.email || 'Anonymous'} •
                  </span>
                  <span className="text-global-2 text-sm sm:text-base lg:text-[24px] lg:leading-[26px] font-normal">
                    {event.start_time ? timeAgo.format(new Date(event.start_time)) : 'No date set'}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="mb-4">
                <h3 className="text-global-1 text-lg sm:text-xl lg:text-[24px] lg:leading-[26px] font-normal mb-2">
                  {event.title}
                </h3>
                <p className="text-global-1 text-sm sm:text-base lg:text-[18px] lg:leading-[20px] mb-3">
                  {event.description}
                </p>
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {event.start_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-global-1 font-semibold">📅 Start:</span>
                      <span className="text-global-1">
                        {new Date(event.start_time).toLocaleDateString()} {new Date(event.start_time).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {event.end_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-global-1 font-semibold">⏰ End:</span>
                      <span className="text-global-1">
                        {new Date(event.end_time).toLocaleDateString()} {new Date(event.end_time).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <span className="text-global-1 font-semibold">📍 Location:</span>
                      <span className="text-global-1">{event.location}</span>
                    </div>
                  )}
                  {event.college_tag && (
                    <div className="flex items-center gap-2">
                      <span className="text-global-1 font-semibold">🏷️ Tag:</span>
                      <span className="text-global-1">{event.college_tag}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleRSVP(event.id)}
                  className="flex items-center gap-2 bg-global-3 text-global-1 px-4 py-2 rounded-lg hover:bg-global-5 transition-colors"
                >
                  <span>👍</span>
                  <span>RSVP</span>
                </button>
                {/* Comment Button */}
                <ActionButton 
                  type="comment" 
                  onClick={() => toggleComments(event.id)}
                >
                  0
                </ActionButton>
                {/* Share Button */}
                <ActionButton 
                  type="share" 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(`${event.title} - ${event.description}`);
                      alert('Event link copied to clipboard!');
                    }
                  }}
                >
                  Share
                </ActionButton>
              </div>
              {visibleComments === event.id && <CommentSection postId={event.id} user={user} />}
            </article>
          ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Events Button - keeping from UI version */}
      <Link
        to="/create-post"
        className="fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full 
        bg-global-2 hover:bg-global-3 transition-all duration-200 
        shadow-lg hover:shadow-xl transform hover:scale-105
        flex items-center justify-center z-50 no-underline"
      >
        <span className="text-5xl font-bold leading-none text-starship-animated">
          +
        </span>
      </Link>
    </div>
  );
};

export default HomePage;