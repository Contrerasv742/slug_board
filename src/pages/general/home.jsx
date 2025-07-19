import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import '../../styles/home.css'
import { supabase } from '../../supabaseClient';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import CommentSection from '../../components/ui/CommentSection';
import { useAuth } from '../../contexts/AuthContext';
import { EventService } from '../../services/eventService';

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [userCreatedEvents, setUserCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [visibleComments, setVisibleComments] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
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
      
      // Separate community events from campus events using event_type
      console.log('All events fetched:', data);
      console.log('Events with event_type check:');
      data?.forEach((event, index) => {
        console.log(`Event ${index}:`, {
          id: event.id,
          title: event.title,
          event_type: event.event_type,
          related_interests: event.related_interests,
          related_interests_length: event.related_interests?.length
        });
      });
      
      const userEvents = data?.filter(event => 
        event.event_type === 'community'
      ) || [];
      
      const otherEvents = data?.filter(event => 
        event.event_type === 'campus' || !event.event_type // fallback for events without event_type
      ) || [];
      
      console.log('User-created events found:', userEvents.length);
      console.log('Other events found:', otherEvents.length);
      
      setUserCreatedEvents(userEvents);
      setEvents(otherEvents);
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
    console.log('Search value changed:', e.target.value);
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    console.log('handleSearch called with searchValue:', searchValue);
    if (!searchValue.trim()) {
      console.log('Search value is empty, fetching all events');
      setIsSearching(false);
      fetchEvents();
      return;
    }
    
    try {
      setLoading(true);
      setIsSearching(true);
      console.log('Searching for events with term:', searchValue);
      const { data, error } = await EventService.searchEvents(searchValue);
      console.log('Search results:', data, 'Error:', error);
      if (error) throw error;
      console.log('Setting events to search results, count:', data?.length || 0);
      
      // Separate search results into community and campus events using event_type
      const userEvents = data?.filter(event => 
        event.event_type === 'community'
      ) || [];
      
      const otherEvents = data?.filter(event => 
        event.event_type === 'campus' || !event.event_type // fallback for events without event_type
      ) || [];
      
      setUserCreatedEvents(userEvents);
      setEvents(otherEvents);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setIsSearching(false);
    fetchEvents();
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
            {/* Search Status and Sort Info */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-global-1 text-sm">
                  📅 Sorted by creation time (newest first)
                </span>
                {isSearching && (
                  <div className="flex items-center gap-2">
                    <span className="text-global-1 text-sm">
                      🔍 Searching for: "{searchValue}"
                    </span>
                    <button
                      onClick={clearSearch}
                      className="text-global-1 hover:text-global-3 text-sm underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Events Feed */}
            <div className="space-y-6">
              {loading && <p className="text-global-1 text-center">Loading events...</p>}
              {error && <p className="text-red-500 text-center">Error fetching events: {error}</p>}
              {!loading && !error && events.length === 0 && userCreatedEvents.length === 0 && (
                <div className="text-center text-global-1">
                  {isSearching ? (
                    <div>
                      <p>No events found matching "{searchValue}"</p>
                      <button
                        onClick={clearSearch}
                        className="mt-2 text-global-3 hover:text-global-5 underline"
                      >
                        View all events
                      </button>
                    </div>
                  ) : (
                    <p>No events found. Create the first event!</p>
                  )}
                </div>
              )}
              
              {/* Community Events Section - Priority at Top */}
              {!loading && !error && userCreatedEvents.length > 0 && (
                <div className="space-y-4 mb-8">
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                        bg-gradient-to-br from-white/[0.12] to-white/[0.04] 
                        border border-white/[0.15] shadow-lg">
                        <span className="w-2 h-2 bg-purple-400/80 rounded-full animate-pulse"></span>
                        <h2 className="text-global-1 text-xl lg:text-2xl font-semibold">Community Events</h2>
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                          {userCreatedEvents.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {userCreatedEvents.map((event) => (
                      <article key={event.id} className="bg-global-2 rounded-[25px] p-4 lg:p-5 
                        shadow-lg hover:shadow-xl transition-all duration-300 
                        border border-white/[0.08] hover:border-purple-400/30
                        hover:bg-gradient-to-br hover:from-global-2 hover:to-purple-900/5">
                        
                        {/* Compact Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <img
                              src="/images/user-avatar.png"
                              className="w-full h-full object-cover rounded-full"
                              alt="User Avatar"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-global-1 font-medium truncate">
                                {event.users?.full_name || event.users?.email || 'Anonymous'}
                              </span>
                              <span className="w-1 h-1 bg-purple-400 rounded-full flex-shrink-0"></span>
                              <span className="text-global-2 truncate">
                                {event.created_at ? timeAgo.format(new Date(event.created_at)) : 'Just now'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Compact Content */}
                        <div className="mb-4">
                          <h3 className="text-global-1 text-lg lg:text-xl font-semibold mb-2 leading-tight line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-global-1 text-sm lg:text-base leading-relaxed line-clamp-3 opacity-90">
                            {event.description}
                          </p>
                        </div>

                        {/* Interest Tags - Compact */}
                        {event.related_interests && event.related_interests.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1.5">
                              {event.related_interests.slice(0, 4).map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-xs font-medium shadow-sm"
                                >
                                  {interest}
                                </span>
                              ))}
                              {event.related_interests.length > 4 && (
                                <span className="px-2 py-1 bg-purple-400/20 text-purple-300 rounded-full text-xs">
                                  +{event.related_interests.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Compact Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-global-3/20">
                          <button
                            onClick={() => handleRSVP(event.id)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
                          >
                            <span>👍</span>
                            <span>RSVP</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleComments(event.id)}
                              className="flex items-center gap-1 px-3 py-2 rounded-full bg-global-3/50 hover:bg-purple-600/20 text-global-1 text-sm transition-all duration-200"
                            >
                              <img src="/images/img_speech_bubble.png" alt="comments" className="w-4 h-4 opacity-70" />
                              <span>0</span>
                            </button>
                            <button 
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: event.title,
                                    text: event.description,
                                    url: window.location.href
                                  });
                                } else {
                                  navigator.clipboard.writeText(`${event.title} - ${event.description}`);
                                  alert('Event link copied to clipboard!');
                                }
                              }}
                              className="p-2 rounded-full bg-global-3/50 hover:bg-purple-600/20 transition-all duration-200"
                            >
                              <img src="/images/share_arrow.png" alt="share" className="w-4 h-4 opacity-70" />
                            </button>
                          </div>
                        </div>
                        {visibleComments === event.id && (
                          <div className="mt-4 pt-4 border-t border-global-3/20">
                            <CommentSection postId={event.id} user={user} />
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Campus Events Section - Below Community Events */}
              {!loading && !error && events.length > 0 && (
                <div className="space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                        bg-gradient-to-br from-global-3/20 to-global-3/5 
                        border border-global-3/30 shadow-md">
                        <span className="w-2 h-2 bg-orange-400/60 rounded-full"></span>
                        <h2 className="text-global-1 text-xl lg:text-2xl font-semibold">Campus Events</h2>
                        <span className="px-2 py-1 bg-global-3 text-global-1 text-xs rounded-full">
                          {events.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  {events.map((event) => (
                    <article key={event.id} className="bg-global-2 rounded-[25px] p-6 lg:p-[24px] 
                      shadow-md hover:shadow-lg transition-all duration-300 
                      border border-global-3/10 hover:border-orange-400/20">
                      {/* Event Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                          <img
                            src="/images/user-avatar.png"
                            className="w-full h-full object-cover rounded-full"
                            alt="User Avatar"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-global-1 text-sm sm:text-base lg:text-[18px] font-medium">
                              {event.users?.full_name || event.users?.email || 'Campus Admin'}
                            </span>
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                            <span className="text-global-2 text-sm lg:text-[16px] font-normal">
                              {event.start_time ? timeAgo.format(new Date(event.start_time)) : 'No date set'}
                            </span>
                          </div>
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
                      <div className="flex items-center gap-4 pt-4 border-t border-global-3/20">
                        <button
                          onClick={() => handleRSVP(event.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-5 py-2.5 rounded-full hover:shadow-md transition-all duration-200 font-medium"
                        >
                          <span>📅</span>
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
              )}
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