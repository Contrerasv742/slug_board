import { supabase } from '../supabaseClient';

export class EventService {
  // Get all events
  static async getAllEvents() {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest events first

      if (error) throw error;
      
      // If we have events, fetch user data for each event
      if (data && data.length > 0) {
        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            if (event.host_id) { // Use host_id instead of user_id
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', event.host_id)
                .single();
              
              return {
                ...event,
                users: userData || null
              };
            }
            return event;
          })
        );
        
        return { data: eventsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get event by ID
  static async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      
      // Fetch user data for the event
      let eventWithUser = data;
      if (data && data.host_id) { // Use host_id instead of user_id
        const { data: userData } = await supabase
          .from('Profiles')
          .select('id, full_name, email')
          .eq('id', data.host_id)
          .single();
        
        eventWithUser = {
          ...data,
          users: userData || null
        };
      }
      
      return { data: eventWithUser, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Create a new event
  static async createEvent(eventData) {
    try {
      console.log('EventService.createEvent called with:', eventData);
      console.log('related_interests specifically:', eventData.related_interests);
      console.log('related_interests type:', typeof eventData.related_interests);
      console.log('related_interests is array:', Array.isArray(eventData.related_interests));
      
      const { data, error } = await supabase
        .from('Events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Event created successfully in database:', data);
      console.log('Created event related_interests:', data.related_interests);
      
      return { data, error: null };
    } catch (error) {
      console.error('EventService.createEvent error:', error);
      return { data: null, error };
    }
  }

  // Update an event
  static async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase
        .from('Events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Delete an event
  static async deleteEvent(eventId) {
    try {
      const { error } = await supabase
        .from('Events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // RSVP to an event
  static async rsvpToEvent(userId, eventId) {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .upsert({
          user_id: userId,
          event_id: eventId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Remove RSVP
  static async removeRSVP(userId, eventId) {
    try {
      const { error } = await supabase
        .from('RSVPs')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get RSVPs for an event
  static async getEventRSVPs(eventId) {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      
      // If we have RSVPs, fetch user data for each RSVP
      if (data && data.length > 0) {
        const rsvpsWithUsers = await Promise.all(
          data.map(async (rsvp) => {
            if (rsvp.user_id) {
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', rsvp.user_id)
                .single();
              
              return {
                ...rsvp,
                users: userData || null
              };
            }
            return rsvp;
          })
        );
        
        return { data: rsvpsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's RSVPs
  static async getUserRSVPs(userId) {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      // If we have RSVPs, fetch event data for each RSVP
      if (data && data.length > 0) {
        const rsvpsWithEvents = await Promise.all(
          data.map(async (rsvp) => {
            if (rsvp.event_id) {
              const { data: eventData } = await supabase
                .from('Events') // Use correct table name with capital E
                .select('*')
                .eq('id', rsvp.event_id)
                .single();
              
              return {
                ...rsvp,
                events: eventData || null
              };
            }
            return rsvp;
          })
        );
        
        return { data: rsvpsWithEvents, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Search events by title and description
  static async searchEvents(searchTerm) {
    try {
      console.log('EventService.searchEvents called with term:', searchTerm);
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false }); // Show newest events first

      console.log('Supabase search query result - Data:', data, 'Error:', error);
      if (error) throw error;
      
      // If we have events, fetch user data for each event
      if (data && data.length > 0) {
        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            if (event.host_id) { // Use host_id instead of user_id
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', event.host_id)
                .single();
              
              return {
                ...event,
                users: userData || null
              };
            }
            return event;
          })
        );
        
        return { data: eventsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get events by category
  static async getEventsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .eq('college_tag', category) // Use college_tag instead of category
        .order('created_at', { ascending: false }); // Show newest events first

      if (error) throw error;
      
      // If we have events, fetch user data for each event
      if (data && data.length > 0) {
        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            if (event.host_id) { // Use host_id instead of user_id
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', event.host_id)
                .single();
              
              return {
                ...event,
                users: userData || null
              };
            }
            return event;
          })
        );
        
        return { data: eventsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get events created by a specific user
  static async getEventsByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .eq('host_id', userId) // Filter by host_id to get events created by this user
        .order('created_at', { ascending: false }); // Show newest events first

      if (error) throw error;
      
      // Fetch user data for the events (though it should be the same user)
      if (data && data.length > 0) {
        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            if (event.host_id) {
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', event.host_id)
                .single();
              
              return {
                ...event,
                users: userData || null
              };
            }
            return event;
          })
        );
        
        return { data: eventsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get upcoming events
  static async getUpcomingEvents() {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      // If we have events, fetch user data for each event
      if (data && data.length > 0) {
        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            if (event.host_id) { // Use host_id instead of user_id
              const { data: userData } = await supabase
                .from('Profiles')
                .select('id, full_name, email')
                .eq('id', event.host_id)
                .single();
              
              return {
                ...event,
                users: userData || null
              };
            }
            return event;
          })
        );
        
        return { data: eventsWithUsers, error: null };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
} 