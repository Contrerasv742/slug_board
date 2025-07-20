// UPDATE: src/pages/general/explore.jsx
// Replace the entire file with this version

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import EventCard from '../../components/ui/EventCard.jsx';
import { supabase } from '../../supabaseClient';
import { EventService } from '../../services/eventService';
import { ExternalEventsService } from '../../services/externalEventsService'; // Add this import

const ExplorePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [eventSources, setEventSources] = useState({ local: 0, external: 0 });
  const [showExternalEvents, setShowExternalEvents] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: '🎯 All Events', icon: '🎯' },
    { id: 'Technology', name: '💻 Tech', icon: '💻' },
    { id: 'Sports', name: '⚽ Sports', icon: '⚽' },
    { id: 'Music', name: '🎵 Music', icon: '🎵' },
    { id: 'Art', name: '🎨 Art', icon: '🎨' },
    { id: 'Photography', name: '📸 Photo', icon: '📸' },
    { id: 'Food', name: '🍕 Food', icon: '🍕' },
    { id: 'Academic', name: '📚 Study', icon: '📚' }
  ];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Enhanced fetch that combines local and external events
  const fetchAllEvents = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all events with search term:', searchTerm);
      
      // Fetch local events and external events in parallel
      const [localResult, externalResult] = await Promise.all([
        // Local events from your database
        searchTerm ? EventService.searchEvents(searchTerm) : EventService.getAllEvents(),
        // External events (always works for everyone)
        showExternalEvents ? ExternalEventsService.getExternalEvents({ query: searchTerm }) : 
                           Promise.resolve({ data: [], error: null })
      ]);

      console.log('Local events result:', localResult);
      console.log('External events result:', externalResult);

      if (localResult.error) {
        console.error('Local events error:', localResult.error);
      }
      
      if (externalResult.error) {
        console.error('External events error:', externalResult.error);
      }

      // Combine events
      const localEvents = localResult.data || [];
      const externalEvents = externalResult.data || [];
      const allEvents = [...localEvents, ...externalEvents];

      // Shuffle for discovery
      const shuffledEvents = allEvents.sort(() => Math.random() - 0.5);
      
      setEvents(shuffledEvents);
      setEventSources({
        local: localEvents.length,
        external: externalEvents.length
      });

      console.log(`✅ Loaded ${localEvents.length} local + ${externalEvents.length} external = ${allEvents.length} total events`);

    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchAllEvents();
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    await fetchAllEvents(searchValue);
  };

  // Search on type (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        handleSearch();
      } else {
        fetchAllEvents();
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, showExternalEvents]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    fetchAllEvents();
  }, []);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRSVP = async (eventId) => {
    if (!user) {
      setError("You must be logged in to RSVP.");
      return;
    }
    
    // Only allow RSVP for local events
    if (eventId.startsWith('external-')) {
      setError("Please visit the original event page to RSVP to external events.");
      return;
    }
    
    try {
      const { error } = await EventService.rsvpToEvent(user.id, eventId);
      if (error) throw error;
      fetchAllEvents(searchValue);
    } catch (error) {
      setError(error.message);
    }
  };

  const getFilteredEvents = () => {
    if (selectedCategory === 'all') {
      return events;
    }
    return events.filter(event => 
      event.related_interests?.includes(selectedCategory)
    );
  };

  const filteredEvents = getFilteredEvents();

  // Event source statistics component
  const EventSourceStats = () => (
    <div className="mb-8 p-6 bg-gradient-to-r from-global-2/50 to-global-2/30 rounded-[25px] border border-global-3/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Event Statistics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h3 className="text-global-1 text-lg font-semibold flex items-center gap-2">
            📊 Event Sources
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-400/30 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium text-sm">Local</span>
              <span className="text-white bg-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {eventSources.local}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-medium text-sm">External</span>
              <span className="text-white bg-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {eventSources.external}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-purple-400 font-medium text-sm">Total</span>
              <span className="text-white bg-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {eventSources.local + eventSources.external}
              </span>
            </div>
          </div>
        </div>
  
        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className="text-global-1 text-sm font-medium">External Events</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showExternalEvents}
              onChange={(e) => setShowExternalEvents(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Quick filter buttons
  const QuickFilters = () => (
    <div className="mb-8">
      <h3 className="text-global-1 text-lg font-semibold mb-4 flex items-center gap-2">
        ⚡ Quick Filters
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <button
          onClick={() => ExternalEventsService.getFreeEvents().then(result => {
            setEvents(result.data);
            setEventSources({ local: 0, external: result.data.length });
          })}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-[15px] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span className="text-lg">💚</span>
          <span className="font-medium">Free Events</span>
        </button>
        
        <button
          onClick={() => ExternalEventsService.getTodayEvents().then(result => {
            setEvents(result.data);
            setEventSources({ local: 0, external: result.data.length });
          })}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-[15px] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span className="text-lg">📅</span>
          <span className="font-medium">Today</span>
        </button>
        
        <button
          onClick={() => fetchAllEvents()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-[15px] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span className="text-lg">🔄</span>
          <span className="font-medium">All Events</span>
        </button>
        
        <button
          onClick={() => ExternalEventsService.getExternalEvents({ category: 'Music' }).then(result => {
            setEvents(result.data);
            setEventSources({ local: 0, external: result.data.length });
          })}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-[15px] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <span className="text-lg">🎵</span>
          <span className="font-medium">Music</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-global-1">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Discover events..."
        userName={user?.email?.split('@')[0] || "Explorer"}
        userHandle={user?.email || 'explorer@email.com'}
        userAvatar="/images/default-avatar.png"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="flex">
        <Sidebar/>

        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div className="mb-8 text-center">
              <div className="inline-block px-6 py-3 rounded-[40px] mb-4
                bg-gradient-to-br from-white/[0.15] to-white/[0.05]
                border border-white/[0.18]
                shadow-[0_8px_32px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]">
                <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                  bg-clip-text text-transparent text-3xl lg:text-[42px] 
                  font-bold drop-shadow-lg animate-gradient-shift">
                  🔍 Explore Events
                </h1>
              </div>
              <p className="text-global-1 text-lg opacity-80">
                Discover amazing events happening around campus and Santa Cruz
              </p>
            </div>

            {/* Event Source Statistics */}
            <EventSourceStats />

            {/* Quick Filters */}
            <QuickFilters />

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-global-1 text-lg font-semibold mb-4">Browse by Category</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md' 
                        : 'bg-global-3 text-global-1 hover:bg-purple-600/20'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-6">
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-global-2 border border-global-3/20">
                    <div className="w-4 h-4 border-2 border-global-3 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-global-1">Loading events from multiple sources...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-900/20 border border-red-500/30">
                    <span className="text-red-400">⚠️</span>
                    <span className="text-red-400">Error: {error}</span>
                  </div>
                </div>
              )}

              {!loading && !error && filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-global-1 text-lg mb-4">No events found in this category</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
                  >
                    Show All Events
                  </button>
                </div>
              )}

              {!loading && !error && filteredEvents.length > 0 && (
                <>
                  <div className="mb-4">
                    <p className="text-global-1 text-sm">
                      {isSearching && `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} for "${searchValue}"`}
                      {!isSearching && `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`}
                      {selectedCategory !== 'all' && !isSearching && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                      {isSearching && (
                        <button
                          onClick={() => {
                            setSearchValue('');
                            setIsSearching(false);
                            fetchAllEvents();
                          }}
                          className="ml-2 text-purple-400 hover:text-purple-300 underline text-xs"
                        >
                          Clear search
                        </button>
                      )}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        variant={event.event_type === 'community' ? 'compact' : 'full'}
                        onRSVP={handleRSVP}
                        user={user}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;