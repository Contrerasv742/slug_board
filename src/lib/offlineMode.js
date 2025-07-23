// Offline mode fallback when Supabase is unavailable
export const isOnlineMode = () => {
  try {
    return navigator.onLine;
  } catch {
    return true; // Default to online
  }
};

export const mockUser = {
  id: "offline-user-123",
  email: "demo@slugboard.com",
  created_at: new Date().toISOString(),
};

export const mockProfile = {
  id: "offline-user-123",
  email: "demo@slugboard.com",
  name: "Demo User",
  username: "demouser",
  avatar_url: "/images/default-avatar.png",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockEvents = [
  {
    id: "1",
    title: "Welcome to SlugBoard!",
    description: "This is a demo event showing how SlugBoard works.",
    location: "UCSC Campus",
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    creator_id: "offline-user-123",
    upvotes: 42,
    downvotes: 3,
    created_at: new Date().toISOString(),
    rsvp_count: 15,
  },
  {
    id: "2",
    title: "Demo Event - Tech Meetup",
    description: "A sample tech meetup event for demonstration purposes.",
    location: "Engineering Building",
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    creator_id: "offline-user-123",
    upvotes: 28,
    downvotes: 1,
    created_at: new Date().toISOString(),
    rsvp_count: 8,
  },
];

export const checkSupabaseConnection = async () => {
  try {
    // Try to make a simple request to check connectivity
    const response = await fetch("https://xzbgwpckoyvlgzfecnmo.supabase.co/rest/v1/", {
      method: "HEAD",
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Ymd3cGNrb3l2bGd6ZmVjbm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzY1OTMsImV4cCI6MjA2Nzc1MjU5M30.MMpYZajKEPfYrDdqG_p-a0ZG7X6P-j9OHp4e2ufXQJ8"
      }
    });
    
    return response.ok;
  } catch (error) {
    console.warn("Supabase connection check failed:", error);
    return false;
  }
}; 