import { supabase } from '../supabaseClient';

export class AuthService {
  // Sign up with email and password
  static async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/home'
        }
      });

      if (error) throw error;

      // If signup is successful and we have a user, store additional user data
      if (data.user) {
        await this.storeUserData(data.user.id, {
          email: data.user.email,
          created_at: new Date().toISOString(),
          ...userData
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Get user session
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  }

  // Store user data in users table
  static async storeUserData(uid, userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: uid,
          ...userData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user data from users table
  static async getUserData(uid) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user data
  static async updateUserData(uid, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', uid);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get events for a user
  static async getUserEvents(uid) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', uid);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get RSVPs for a user
  static async getUserRSVPs(uid) {
    try {
      const { data, error } = await supabase
        .from('RSVPs')
        .select(`
          *,
          events (*)
        `)
        .eq('user_id', uid);

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
        .insert(eventData);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
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
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Update password
  static async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Social login
  static async signInWithProvider(provider) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}

// Auth state listener
export const authStateListener = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}; 