import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [classYear, setClassYear] = useState('');
  const [username, setUsername] = useState('');

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
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        // Initialize form state
        if (data) {
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setLocation(data.location || '');
          setClassYear(data.class_year || '');
          setUsername(data.username || '');
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
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const updates = {
        id: user.id,
        full_name: fullName,
        bio,
        location,
        class_year: classYear,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      
      setProfile(updates);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  const interests = [
    'Technology', 'Design', 'Photography', 'Music', 'Gaming', 'Art'
  ];

  const recentPosts = [
    {
      title: 'Campus Hackathon 2024',
      description: 'Join us for the biggest hackathon of the year!',
      timeAgo: '2 days ago',
      upvotes: 45
    },
    {
      title: 'Study Group - Advanced Algorithms',
      description: 'Looking for study partners for CS 130',
      timeAgo: '1 week ago',
      upvotes: 23
    },
    {
      title: 'Photography Club Meeting',
      description: 'Monthly meetup for photography enthusiasts',
      timeAgo: '2 weeks ago',
      upvotes: 67
    }
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
        userName={profile?.full_name || "John Doe"}
        userHandle={`@${profile?.username || 'johndoe'}`}
        userAvatar="/images/default-avatar.png"
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
                          src="/images/user-avatar.png"
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
                          {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-5 h-5
                        bg-green-500 rounded-full border-3
                        border-global-2"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center w-full">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          className="bg-global-3 text-white text-2xl lg:text-[28px] rounded p-2 mb-2 w-full text-center" 
                          placeholder="Full Name"
                        />
                      ) : (
                        <h1 className="text-global-1 text-2xl lg:text-[28px] lg:leading-[32px] font-normal mb-2">
                          {profile?.full_name || 'User Name'}
                        </h1>
                      )}
                      
                      {isEditing ? (
                        <textarea 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          className="bg-global-3 text-white text-lg lg:text-[18px] rounded p-2 mb-2 w-full" 
                          placeholder="Bio"
                          rows="3"
                        />
                      ) : (
                        <p className="text-global-1 text-lg lg:text-[18px] lg:leading-[22px] font-normal mb-2">
                          {profile?.bio || 'User Bio'}
                        </p>
                      )}
                      
                      {isEditing ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            className="bg-global-3 text-white text-sm rounded p-2 w-full" 
                            placeholder="Location" 
                          />
                          <input 
                            type="text" 
                            value={classYear} 
                            onChange={(e) => setClassYear(e.target.value)} 
                            className="bg-global-3 text-white text-sm rounded p-2 w-full" 
                            placeholder="Class Year" 
                          />
                          <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="bg-global-3 text-white text-sm rounded p-2 w-full" 
                            placeholder="Username" 
                          />
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm lg:text-[14px] lg:leading-[16px]">
                          {profile?.location || 'Location'} • {profile?.class_year || 'Class Year'} • @{profile?.username || 'username'}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 justify-center">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              handleProfileUpdate();
                            }
                            setIsEditing(!isEditing);
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-[15px] transition-colors duration-200 text-sm lg:text-[16px]"
                        >
                          {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </button>
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
                  
                  <div className="space-y-4">
                    {recentPosts.map((post, index) => (
                      <div key={index} className="bg-global-3 rounded-[20px] p-4 lg:p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-global-1 text-lg lg:text-[20px] font-normal">{post.title}</h4>
                          <span className="text-gray-400 text-xs lg:text-[12px] flex-shrink-0 ml-4">{post.timeAgo}</span>
                        </div>
                        <p className="text-global-1 text-sm lg:text-[16px] lg:leading-[20px] mb-3">{post.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 bg-global-2 rounded-[10px] px-3 py-1">
                            <img src="/images/img_arrow.png" alt="upvote" className="w-4 h-4" />
                            <span className="text-global-1 text-sm lg:text-[16px]">{post.upvotes}</span>
                          </div>
                          <button className="text-purple-400 hover:text-purple-300 text-sm lg:text-[14px]">
                            View Post
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <h3 className="text-global-1 text-xl lg:text-[24px] font-normal mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs lg:text-[14px]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
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
