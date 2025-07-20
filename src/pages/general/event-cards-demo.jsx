import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import EventCard from '../../components/ui/EventCard.jsx';
import { supabase } from '../../supabaseClient';
import { EventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

const EventCardsDemo = () => {
  const [events, setEvents] = useState([]);
  const [userCreatedEvents, setUserCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events for demo...');
      const { data, error } = await EventService.getAllEvents();
      
      if (error) {
        console.error('Error from EventService:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      
      // Separate community events from campus events using event_type
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

  // Sample event data for demonstration (fallback if no real events)
  const sampleCommunityEvent = {
    id: 'sample-community-1',
    title: 'Sample Community Event',
    description: 'This is a sample community event created by users. It demonstrates the compact card design with purple theme.',
    created_at: new Date().toISOString(),
    event_type: 'community',
    related_interests: ['Technology', 'Networking', 'Social', 'Learning'],
    users: {
      full_name: 'John Doe',
      email: 'john@example.com'
    }
  };

  const sampleCampusEvent = {
    id: 'sample-campus-1',
    title: 'Sample Campus Event',
    description: 'This is a sample campus event with full details including location, time, and college tags. It demonstrates the full card design with orange theme.',
    created_at: new Date().toISOString(),
    start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    end_time: new Date(Date.now() + 86400000 + 7200000).toISOString(), // Tomorrow + 2 hours
    location: 'Main Campus Hall',
    college_tag: 'Computer Science',
    event_type: 'campus',
    related_interests: ['Academic', 'Workshop', 'Technology'],
    users: {
      full_name: 'Campus Admin',
      email: 'admin@campus.edu'
    }
  };

  return (
    <div className="min-h-screen bg-global-1">
      {/* Header */}
      <Header 
        showSearch={false}
        userName={user?.email || "Demo User"}
        userHandle={`@${user?.email?.split('@')[0] || 'demo'}`}
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Page */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-global-1 text-3xl lg:text-4xl font-bold mb-4">
                Event Cards Demo
              </h1>
              <p className="text-global-1 text-lg opacity-80">
                Showcasing the EventCard component with real data from your database
              </p>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-global-2 border border-global-3/20">
                  <div className="w-4 h-4 border-2 border-global-3 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-global-1">Loading events from database...</span>
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

            {/* Community Events Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                    bg-gradient-to-br from-white/[0.12] to-white/[0.04] 
                    border border-white/[0.15] shadow-lg">
                    <span className="w-2 h-2 bg-purple-400/80 rounded-full animate-pulse"></span>
                    <h2 className="text-global-1 text-xl lg:text-2xl font-semibold">Community Events (Compact Cards)</h2>
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                      {userCreatedEvents.length || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Community Events Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userCreatedEvents.length > 0 ? (
                  userCreatedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      onRSVP={handleRSVP}
                      user={user}
                    />
                  ))
                ) : (
                  // Show sample event if no real events
                  <EventCard
                    event={sampleCommunityEvent}
                    variant="compact"
                    onRSVP={handleRSVP}
                    user={user}
                  />
                )}
              </div>
            </div>

            {/* Campus Events Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                    bg-gradient-to-br from-global-3/20 to-global-3/5 
                    border border-global-3/30 shadow-md">
                    <span className="w-2 h-2 bg-orange-400/60 rounded-full"></span>
                    <h2 className="text-global-1 text-xl lg:text-2xl font-semibold">Campus Events (Full Cards)</h2>
                    <span className="px-2 py-1 bg-global-3 text-global-1 text-xs rounded-full">
                      {events.length || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Events List */}
              <div className="space-y-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="full"
                      onRSVP={handleRSVP}
                      user={user}
                    />
                  ))
                ) : (
                  // Show sample event if no real events
                  <EventCard
                    event={sampleCampusEvent}
                    variant="full"
                    onRSVP={handleRSVP}
                    user={user}
                  />
                )}
              </div>
            </div>

            {/* Component Usage Instructions */}
            <div className="bg-global-2 rounded-[25px] p-6 border border-global-3/20">
              <h3 className="text-global-1 text-xl font-semibold mb-4">How to Use EventCard Component</h3>
              <div className="space-y-4 text-global-1">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Compact Variant (Community Events):</h4>
                  <pre className="bg-global-3/20 rounded-lg p-3 text-sm overflow-x-auto">
{`<EventCard
  event={eventData}
  variant="compact"
  onRSVP={handleRSVP}
  user={currentUser}
/>`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Full Variant (Campus Events):</h4>
                  <pre className="bg-global-3/20 rounded-lg p-3 text-sm overflow-x-auto">
{`<EventCard
  event={eventData}
  variant="full"
  onRSVP={handleRSVP}
  user={currentUser}
/>`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-global-3 mb-2">Props:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><code className="bg-global-3/20 px-1 rounded">event</code> - Event object with all event data</li>
                    <li><code className="bg-global-3/20 px-1 rounded">variant</code> - "compact" or "full" (default: "full")</li>
                    <li><code className="bg-global-3/20 px-1 rounded">onRSVP</code> - Function to handle RSVP action</li>
                    <li><code className="bg-global-3/20 px-1 rounded">user</code> - Current user object for comments</li>
                    <li><code className="bg-global-3/20 px-1 rounded">className</code> - Additional CSS classes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventCardsDemo; 