import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import { EventService } from '../services/eventService';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  // Profile picture upload states
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [classYear, setClassYear] = useState('');
  const [username, setUsername] = useState('');
  const [userInterests, setUserInterests] = useState([]);

  // Store original values for cancel functionality
  const [originalValues, setOriginalValues] = useState({});

  // Predefined interests/categories that users can choose from
  const availableInterests = [
    'Technology', 'Computer Science', 'Programming', 'Gaming',
    'Music', 'Art', 'Photography', 'Design', 'Creative Writing',
    'Sports', 'Fitness', 'Basketball', 'Soccer', 'Tennis', 'Swimming',
    'Academic', 'Study Groups', 'Research', 'Mathematics', 'Science',
    'Environmental', 'Sustainability', 'Hiking', 'Nature', 'Gardening',
    'Social', 'Networking', 'Community Service', 'Volunteering',
    'Workshop', 'Learning', 'Teaching', 'Mentoring',
    'Food', 'Cooking', 'Restaurants', 'Nutrition',
    'Travel', 'Adventure', 'Exploration', 'Culture',
    'Books', 'Reading', 'Literature', 'Poetry',
    'Movies', 'Film', 'Animation', 'Entertainment',
    'Business', 'Entrepreneurship', 'Finance', 'Career',
    'Health', 'Mental Health', 'Wellness', 'Meditation',
    'Other'
  ];

  // Profile picture upload function
  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('Profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date() })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setAvatarUrl(publicUrl);
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle avatar file selection
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInMs = now.getTime() - eventDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInWeeks = diffInDays / 7;

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (diffInWeeks < 4) {
      const weeks = Math.floor(diffInWeeks);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else {
      return eventDate.toLocaleDateString();
    }
  };

  // Fetch user events
  const fetchUserEvents = async (userId) => {
    try {
      setEventsLoading(true);
      const { data, error } = await EventService.getEventsByUser(userId);
      
      if (error) {
        console.error('Error fetching user events:', error);
        return;
      }
      
      setUserEvents(data || []);
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('Profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          // If profile doesn't exist (PGRST116 error), create it automatically
          if (error.code === 'PGRST116') {
            console.log('No profile found, creating new profile for user:', user.id);
            
            const newProfile = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
              username: null,
              bio: null,
              location: null,
              class_year: null,
              avatar_url: user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('Profiles')
              .insert(newProfile)
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              throw createError;
            }

            console.log('Profile created successfully:', createdProfile);
            setProfile(createdProfile);
            
            // Initialize form state with new profile
            setFullName(createdProfile.name || '');
            setBio(createdProfile.bio || '');
            setLocation(createdProfile.location || '');
            setClassYear(createdProfile.class_year || '');
            setUsername(createdProfile.username || '');
            setUserInterests(createdProfile.interests || []);
            setAvatarUrl(createdProfile.avatar_url || null);
            setOriginalValues({
              full_name: createdProfile.name || '',
              bio: createdProfile.bio || '',
              location: createdProfile.location || '',
              class_year: createdProfile.class_year || '',
              username: createdProfile.username || '',
              interests: createdProfile.interests || []
            });
            
            // Fetch user events for the new profile
            fetchUserEvents(createdProfile.id);
            return; // Exit early since we've handled the profile creation
          } else {
            throw error; // Re-throw other errors
          }
        }
        setProfile(data);
        // Initialize form state
        if (data) {
          setFullName(data.name || '');
          setBio(data.bio || '');
          setLocation(data.location || '');
          setClassYear(data.class_year || '');
          setUsername(data.username || '');
          setUserInterests(data.interests || []);
          setAvatarUrl(data.avatar_url || null);
          // Initialize original values for cancel functionality
          setOriginalValues({
            full_name: data.name || '',
            bio: data.bio || '',
            location: data.location || '',
            class_year: data.class_year || '',
            username: data.username || '',
            interests: data.interests || []
          });
          
          // Fetch user events for the existing profile
          fetchUserEvents(data.id);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Basic validation
      if (!fullName.trim()) {
        throw new Error("Full name is required");
      }
      
      if (!username.trim()) {
        throw new Error("Username is required");
      }
      
             // Check if username is unique (if changed)
       if (username !== originalValues.username) {
         const { data: existingUser } = await supabase
           .from('Profiles')
           .select('id')
           .eq('username', username)
           .neq('id', profile.id)
           .single();
          
        if (existingUser) {
          throw new Error("Username already exists. Please choose a different one.");
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const updates = {
        id: user.id,
        name: fullName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        class_year: classYear.trim(),
        username: username.trim(),
        interests: userInterests,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('Profiles').upsert(updates);

      if (error) throw error;
      
      setProfile(updates);
      setOriginalValues(updates);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Restore original values
    setFullName(originalValues.full_name || '');
    setBio(originalValues.bio || '');
    setLocation(originalValues.location || '');
    setClassYear(originalValues.class_year || '');
    setUsername(originalValues.username || '');
    setUserInterests(originalValues.interests || []);
    setError(null);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    // Store current values for cancel functionality
    setOriginalValues({
      full_name: profile?.name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      class_year: profile?.class_year || '',
      username: profile?.username || '',
      interests: userInterests || []
    });
    setError(null);
    setIsEditing(true);
  };

  // Add interest to user's list
  const handleAddInterest = (interest) => {
    if (!userInterests.includes(interest)) {
      setUserInterests([...userInterests, interest]);
    }
  };

  // Remove interest from user's list
  const handleRemoveInterest = (interest) => {
    setUserInterests(userInterests.filter(item => item !== interest));
  };

  const personalityTraits = [
    { name: 'Extrovert', value: 9, color: 'bg-red-500' },
    { name: 'Creative', value: 7, color: 'bg-orange-500' },
    { name: 'Analytical', value: 6, color: 'bg-yellow-500' },
    { name: 'Adventurous', value: 10, color: 'bg-green-500' },
    { name: 'Social', value: 8, color: 'bg-blue-500' }
  ];

  const goals = [
    'Graduate with honors',
    'Learn new programming languages',
    'Organize more campus events',
    'Build a stronger community presence',
    'Share knowledge and experiences'
  ];

  // Use user's actual interests from database, fallback to some defaults for display
  const displayInterests = userInterests.length > 0 ? userInterests : [
    'Technology', 'Design', 'Photography', 'Music', 'Gaming', 'Art'
  ];

  if (loading) {
    return <div className="min-h-screen bg-global-1 flex items-center justify-center">
      <p className="text-global-1">Loading profile...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-global-1">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName={profile?.name || "John Doe"}
        userHandle={`@${profile?.username || 'johndoe'}`}
        userAvatar={avatarUrl || "/images/default-avatar.png"}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Profile Content */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-7xl mx-auto">

            {/* Main Profile Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column - Profile Header Info */}
              <div className="lg:col-span-4 h-full">
                <div className="bg-global-2 rounded-[35px] p-6 lg:p-[32px]">
                  <div className="flex flex-col items-center text-center gap-6">

                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-24 h-24 lg:w-[120px] lg:h-[120px]
                        bg-gradient-to-br from-purple-400 to-blue-500
                        rounded-full flex items-center justify-center
                        overflow-hidden">
                        <img
                          src={avatarUrl || "/images/user-avatar.png"}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br
                          from-purple-400 to-blue-500 flex items-center
                          justify-center text-white text-3xl lg:text-5xl
                          font-bold" style={{display: 'none'}}>
                          {profile?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-5 h-5
                        bg-green-500 rounded-full border-3
                        border-global-2"></div>
                      
                      {/* Upload Button */}
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => document.getElementById('avatar-upload').click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 rounded-full flex items-center justify-center text-white text-sm transition-colors duration-200"
                        title="Upload profile picture"
                      >
                        {uploading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center w-full">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          className="bg-global-3 text-white text-2xl lg:text-[28px] rounded-[15px] p-2 mb-2 w-full text-center border-2 border-transparent focus:border-purple-500 focus:outline-none transition-colors" 
                          placeholder="Enter your full name"
                          maxLength={100}
                          required
                        />
                      ) : (
                        <h1 className="text-global-1 text-2xl lg:text-[28px] lg:leading-[32px] font-normal mb-2">
                          {profile?.name || 'User Name'}
                        </h1>
                      )}
                      
                      {isEditing ? (
                        <div className="w-full">
                          <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            className="bg-global-3 text-white text-lg lg:text-[18px] rounded-[15px] p-3 mb-1 w-full border-2 border-transparent focus:border-purple-500 focus:outline-none transition-colors resize-none" 
                            placeholder="Tell us about yourself..."
                            rows="3"
                            maxLength={500}
                          />
                          <p className="text-gray-400 text-xs text-right mb-2">{bio.length}/500</p>
                        </div>
                      ) : (
                        <p className="text-global-1 text-lg lg:text-[18px] lg:leading-[22px] font-normal mb-2">
                          {profile?.bio || 'User Bio'}
                        </p>
                      )}
                      
                      {isEditing ? (
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            className="bg-global-3 text-white text-sm rounded-[15px] p-3 w-full border-2 border-transparent focus:border-purple-500 focus:outline-none transition-colors" 
                            placeholder="e.g., Santa Cruz, CA" 
                            maxLength={100}
                          />
                          <input 
                            type="text" 
                            value={classYear} 
                            onChange={(e) => setClassYear(e.target.value)} 
                            className="bg-global-3 text-white text-sm rounded-[15px] p-3 w-full border-2 border-transparent focus:border-purple-500 focus:outline-none transition-colors" 
                            placeholder="e.g., Class of 2025" 
                            maxLength={50}
                          />
                          <div className="relative">
                            <input 
                              type="text" 
                              value={username} 
                              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
                              className="bg-global-3 text-white text-sm rounded-[15px] p-3 w-full pl-6 border-2 border-transparent focus:border-purple-500 focus:outline-none transition-colors" 
                              placeholder="username" 
                              maxLength={30}
                              required
                            />
                            <span className="absolute left-3 top-3 text-gray-400 text-sm">@</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm lg:text-[14px] lg:leading-[16px]">
                          {profile?.location || 'Location'} • {profile?.class_year || 'Class Year'} • @{profile?.username || 'username'}
                        </p>
                      )}

                      {/* Error Display */}
                      {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-[15px] text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 justify-center flex-wrap">
                        <button
                          onClick={isEditing ? handleProfileUpdate : handleStartEdit}
                          disabled={saving}
                          className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed text-white px-4 py-2 lg:px-6 lg:py-2 rounded-[15px] transition-colors duration-200 text-sm lg:text-[16px]"
                        >
                          {saving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Profile')}
                        </button>
                        {isEditing && (
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 lg:px-6 lg:py-2 rounded-[15px] transition-colors duration-200 text-sm lg:text-[16px]"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-[15px] transition-colors duration-200 text-sm lg:text-[16px]"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-8 space-y-6 h-full">

                {/* Recent Activity */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[32px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-global-1 text-xl lg:text-[24px] font-normal">Recent Posts</h3>
                    <button className="text-purple-400 hover:text-purple-300 text-sm lg:text-[16px]">
                      View All
                    </button>
                  </div>
                  
                  {eventsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading events...</p>
                    </div>
                  ) : userEvents.length > 0 ? (
                    <div className="space-y-4">
                      {userEvents.slice(0, 3).map((event, index) => (
                        <div key={event.id || index} className="bg-global-3 rounded-[20px] p-4 lg:p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-global-1 text-lg lg:text-[20px] font-normal">{event.title}</h4>
                            <span className="text-gray-400 text-xs lg:text-[12px] flex-shrink-0 ml-4">{formatTimeAgo(event.created_at)}</span>
                          </div>
                          <p className="text-global-1 text-sm lg:text-[16px] lg:leading-[20px] mb-3">
                            {event.description || 'No description provided'}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            {event.location && (
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <span>📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.start_time && (
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <span>🗓️</span>
                                <span>{new Date(event.start_time).toLocaleDateString()}</span>
                              </div>
                            )}
                            <button className="text-purple-400 hover:text-purple-300 text-sm lg:text-[14px]">
                              View Event
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No events posted yet</p>
                      <button 
                        onClick={() => navigate('/create-post')}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-[15px] transition-colors duration-200"
                      >
                        Create Your First Event
                      </button>
                    </div>
                  )}
                </div>

                {/* Personality Traits */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[32px]">
                  <h3 className="text-global-1 text-xl lg:text-[24px]
                    font-normal mb-4">Personality</h3>
                  <div className="space-y-[23px]">
                    {personalityTraits.map((trait, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-global-1 text-sm
                            lg:text-[16px]">{trait.name}</span>
                          <span className="text-gray-400 text-sm
                            lg:text-[14px]">{trait.value}/10</span>
                        </div>
                        <div className="w-full bg-global-3 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500
                            to-blue-500 h-2 rounded-full transition-all
                            duration-500"
                            style={{ width: `${trait.value * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
                  <h3 className="text-global-1 text-xl lg:text-[24px] font-normal mb-4">Goals</h3>
                  <div className="space-y-3">
                    {goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-global-1 text-sm lg:text-[16px] lg:leading-[20px]">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-global-1 text-xl lg:text-[24px] font-normal">Interests</h3>
                    {!isEditing && (
                      <button
                        onClick={handleStartEdit}
                        className="text-purple-400 hover:text-purple-300 text-sm lg:text-[14px]"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Available interests to add */}
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Add interests:</p>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {availableInterests
                            .filter(interest => !userInterests.includes(interest))
                            .map((interest, index) => (
                            <button
                              key={index}
                              onClick={() => handleAddInterest(interest)}
                              className="bg-global-3 hover:bg-purple-500 text-white px-3 py-1 rounded-full text-xs lg:text-[14px] transition-colors border border-gray-600 hover:border-purple-500"
                            >
                              + {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Selected interests */}
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Your interests (click to remove):</p>
                        <div className="flex flex-wrap gap-2">
                          {userInterests.map((interest, index) => (
                            <button
                              key={index}
                              onClick={() => handleRemoveInterest(interest)}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-red-500 hover:to-red-600 text-white px-3 py-1 rounded-full text-xs lg:text-[14px] transition-all duration-200"
                              title="Click to remove"
                            >
                              {interest} ×
                            </button>
                          ))}
                          {userInterests.length === 0 && (
                            <p className="text-gray-400 text-sm italic">No interests selected yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {displayInterests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs lg:text-[14px]"
                        >
                          {interest}
                        </span>
                      ))}
                      {displayInterests.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No interests added yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
