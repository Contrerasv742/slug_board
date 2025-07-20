import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import EventCard from '../../components/ui/EventCard.jsx';
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
                      <EventCard
                        key={event.id}
                        event={event}
                        variant="compact"
                        onRSVP={handleRSVP}
                        user={user}
                      />
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
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="full"
                      onRSVP={handleRSVP}
                      user={user}
                    />
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