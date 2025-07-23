import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
// Removed SimpleLoadingScreen and offlineMode.js imports

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Removed timeout logic - auth loading is handled naturally by Supabase responses

  useEffect(() => {
    // Safety timeout to avoid infinite loading
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000); // 8 seconds fallback

    return () => clearTimeout(safetyTimeout);
  }, []);

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading user profile:", error);
        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          await createUserProfile(userId);
        } else {
          // For other errors, just continue without profile
          setProfile(null);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email || "";

      const { data, error } = await supabase
        .from("Profiles")
        .insert([
          {
            id: userId,
            email: userEmail,
            name: userEmail.split("@")[0], // Default name from email
            username: userEmail.split("@")[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating user profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      setProfile(null);
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("Profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    updateProfile,
  };

  // Remove loading screen - just provide context without blocking UI
  // Loading state is handled by individual components that need it

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
