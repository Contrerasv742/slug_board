import { supabase } from '../supabaseClient';

export class EventService {
  // Get all events
  static async getAllEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users (id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get event by ID
  static async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users (id, full_name, email),
          RSVPs (
            *,
            users (id, full_name, email)
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Create a new event
  static async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update an event
  static async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // RSVP to an event
  static async rsvpToEvent(userId, eventId, status = 'going') {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .upsert({
          user_id: userId,
          event_id: eventId,
          status: status,
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
        .select(`
          *,
          users (id, full_name, email)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's RSVPs
  static async getUserRSVPs(userId) {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .select(`
          *,
          events (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Search events
  static async searchEvents(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users (id, full_name, email)
        `)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get events by category
  static async getEventsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users (id, full_name, email)
        `)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get upcoming events
  static async getUpcomingEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users (id, full_name, email)
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
} 