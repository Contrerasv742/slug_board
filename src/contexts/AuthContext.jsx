import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, authStateListener } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [userRSVPs, setUserRSVPs] = useState([]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await AuthService.getSession();
        const { user } = await AuthService.getCurrentUser();
        
        setSession(session);
        setUser(user);
        
        if (user) {
          // Get user data from users table
          const { data: userInfo } = await AuthService.getUserData(user.id);
          setUserData(userInfo);
          
          // Get user events and RSVPs
          const { data: events } = await AuthService.getUserEvents(user.id);
          const { data: rsvps } = await AuthService.getUserRSVPs(user.id);
          
          setUserEvents(events || []);
          setUserRSVPs(rsvps || []);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = authStateListener(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user data when user signs in
        const { data: userInfo } = await AuthService.getUserData(session.user.id);
        setUserData(userInfo);
        
        // Get user events and RSVPs
        const { data: events } = await AuthService.getUserEvents(session.user.id);
        const { data: rsvps } = await AuthService.getUserRSVPs(session.user.id);
        
        setUserEvents(events || []);
        setUserRSVPs(rsvps || []);
      } else {
        setUserData(null);
        setUserEvents([]);
        setUserRSVPs([]);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    const { data, error } = await AuthService.signUp(email, password, userData);
    if (!error && data?.user) {
      setUser(data.user);
      // User data will be set by the auth state listener
    }
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await AuthService.signIn(email, password);
    if (!error && data?.user) {
      setUser(data.user);
      // User data will be set by the auth state listener
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (!error) {
      setUser(null);
      setUserData(null);
      setUserEvents([]);
      setUserRSVPs([]);
    }
    return { error };
  };

  const updateUserData = async (updates) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { data, error } = await AuthService.updateUserData(user.id, updates);
    if (!error && data) {
      setUserData(prev => ({ ...prev, ...updates }));
    }
    return { data, error };
  };

  const createEvent = async (eventData) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const eventWithUserId = { ...eventData, user_id: user.id };
    const { data, error } = await AuthService.createEvent(eventWithUserId);
    if (!error && data) {
      setUserEvents(prev => [...prev, data[0]]);
    }
    return { data, error };
  };

  const rsvpToEvent = async (eventId, status = 'going') => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { data, error } = await AuthService.rsvpToEvent(user.id, eventId, status);
    if (!error && data) {
      // Refresh RSVPs list
      const { data: rsvps } = await AuthService.getUserRSVPs(user.id);
      setUserRSVPs(rsvps || []);
    }
    return { data, error };
  };

  const resetPassword = async (email) => {
    return await AuthService.resetPassword(email);
  };

  const updatePassword = async (newPassword) => {
    return await AuthService.updatePassword(newPassword);
  };

  const signInWithProvider = async (provider) => {
    return await AuthService.signInWithProvider(provider);
  };

  const value = {
    user,
    session,
    userData,
    userEvents,
    userRSVPs,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserData,
    createEvent,
    rsvpToEvent,
    resetPassword,
    updatePassword,
    signInWithProvider,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 