import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, authStateListener } from '../services/authService';
import { runDatabaseSetup } from '../utils/databaseSetup';

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
    // Run database setup check
    const initializeAuth = async () => {
      try {
        // Check database setup
        const dbSetupOk = await runDatabaseSetup();
        if (!dbSetupOk) {
          console.warn('Database setup check failed - user storage may not work properly');
        }
        
        // Get initial session
        await getInitialSession();
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setLoading(false);
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await AuthService.getSession();
        const { user } = await AuthService.getCurrentUser();
        
        setSession(session);
        setUser(user);
        
        if (user) {
          console.log('Initial session - user found:', user.id);
          
          // Get user data from users table
          const { data: userInfo, error: userError } = await AuthService.getUserData(user.id);
          
          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user data:', userError);
          }
          
          // If user doesn't exist in our database, create them
          if (!userInfo && user) {
            console.log('Creating new user in database (initial session):', user.id);
            const userData = {
              email: user.email,
              created_at: new Date().toISOString(),
              provider: user.app_metadata?.provider || 'email',
              last_sign_in: new Date().toISOString(),
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || null
            };
            
            const { data: storedUser, error: storeError } = await AuthService.storeUserData(user.id, userData);
            if (storeError) {
              console.error('Error storing user data:', storeError);
            } else {
              console.log('User data stored successfully (initial session):', storedUser);
              setUserData(userData);
            }
          } else if (userInfo) {
            // Update last sign in for existing users
            const { error: updateError } = await AuthService.updateUserData(user.id, {
              last_sign_in: new Date().toISOString()
            });
            if (updateError) {
              console.error('Error updating last sign in:', updateError);
            }
            setUserData(userInfo);
          }
          
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

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = authStateListener(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Get user data when user signs in
          const { data: userInfo, error: userError } = await AuthService.getUserData(session.user.id);
          
          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user data:', userError);
          }
          
          // If user doesn't exist in our database, create them
          if (!userInfo && session.user) {
            console.log('Creating new user in database:', session.user.id);
            const userData = {
              email: session.user.email,
              created_at: new Date().toISOString(),
              provider: session.user.app_metadata?.provider || 'email',
              last_sign_in: new Date().toISOString(),
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null
            };
            
            const { data: storedUser, error: storeError } = await AuthService.storeUserData(session.user.id, userData);
            if (storeError) {
              console.error('Error storing user data:', storeError);
            } else {
              console.log('User data stored successfully:', storedUser);
              setUserData(userData);
            }
          } else if (userInfo) {
            // Update last sign in for existing users
            const { error: updateError } = await AuthService.updateUserData(session.user.id, {
              last_sign_in: new Date().toISOString()
            });
            if (updateError) {
              console.error('Error updating last sign in:', updateError);
            }
            setUserData(userInfo);
          }
          
          // Get user events and RSVPs
          const { data: events } = await AuthService.getUserEvents(session.user.id);
          const { data: rsvps } = await AuthService.getUserRSVPs(session.user.id);
          
          setUserEvents(events || []);
          setUserRSVPs(rsvps || []);
        } catch (error) {
          console.error('Error in auth state listener:', error);
        }
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
      
      // Ensure user is stored in our database
      try {
        const { data: userInfo } = await AuthService.getUserData(data.user.id);
        if (!userInfo) {
          console.log('Creating new user in database (sign in):', data.user.id);
          const userData = {
            email: data.user.email,
            created_at: new Date().toISOString(),
            provider: 'email',
            last_sign_in: new Date().toISOString()
          };
          
          const { error: storeError } = await AuthService.storeUserData(data.user.id, userData);
          if (storeError) {
            console.error('Error storing user data:', storeError);
          } else {
            console.log('User data stored successfully (sign in)');
          }
        }
      } catch (error) {
        console.error('Error ensuring user storage:', error);
      }
      
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