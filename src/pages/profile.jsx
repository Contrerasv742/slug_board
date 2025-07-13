import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProfilePage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Profile');
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

  const menuItems = [
    { name: 'Home', path: '/home' },
    { name: 'Create Post', path: '/create-post' },
    { name: 'Profile', path: '/profile' },
    { name: 'Map', path: '/map' },
  ];

  const userStats = [
    { label: 'Posts Created', value: '27', color: 'bg-purple-500' },
    { label: 'Events Shared', value: '43', color: 'bg-blue-500' },
    { label: 'Total Upvotes', value: '1.2k', color: 'bg-green-500' },
    { label: 'Community Rank', value: '#156', color: 'bg-orange-500' }
  ];

  const personalityTraits = [
    { name: 'Extrovert', value: 85 },
    { name: 'Creative', value: 72 },
    { name: 'Analytical', value: 60 },
    { name: 'Adventurous', value: 90 },
    { name: 'Social', value: 78 }
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
      <header className="bg-global-1 border-b-2 border-white border-opacity-60 p-4 sm:p-6 lg:p-[16px_32px]">
        <div className="flex flex-row items-center justify-between w-full max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">
          {/* Logo Section */}
          <div className="flex flex-row items-center justify-start flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-sm">
              <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain"
                alt="Slug Board Logo"
              />
            </div>
            <h1 className="text-global-4 font-ropa text-lg sm:text-xl md:text-2xl lg:text-[28px] lg:leading-[30px] font-normal ml-2 sm:ml-3 lg:ml-[16px] text-starship-animated">
              Slug Board
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <img
                src="/images/img_search.png"
                alt="search"
                className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-[40px] bg-global-2 text-global-1 rounded-[20px] border-none outline-none text-sm sm:text-base md:text-lg lg:text-xl lg:leading-[10px] py-[2px] sm:py-[4px] lg:py-[2px] pl-10 lg:pl-[45px] placeholder-gray-400"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex flex-row items-center justify-end flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-full">
              <img
                src="/images/user-avatar.png"
                className="w-full h-full object-cover rounded-full"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2 border-white border-opacity-60 p-5">
          <nav className="w-full space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenuItem(item.name)}
                className={`flex justify-center items-center p-3 rounded-[10px] transition-all duration-200 lg:h-10 border-none cursor-pointer font-normal
                           ${activeMenuItem === item.name 
                             ? 'bg-global-2 text-global-1' 
                             : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                           }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[44px_48px]">
          <div className="max-w-6xl mx-auto">
            
            {/* Profile Header */}
            <div className="bg-global-2 rounded-[35px] p-6 lg:p-[32px] mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 lg:w-[160px] lg:h-[160px] bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/user-avatar.png"
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold" style={{display: 'none'}}>
                      JS
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-global-2"></div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      {isEditing ? (
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-global-3 text-white text-2xl lg:text-[36px] rounded p-2 mb-2" />
                      ) : (
                        <h1 className="text-global-1 text-2xl lg:text-[36px] lg:leading-[40px] font-normal mb-2">
                          {profile?.full_name || 'User Name'}
                        </h1>
                      )}
                      {isEditing ? (
                        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} className="bg-global-3 text-white text-lg lg:text-[24px] rounded p-2 mb-2 w-full" />
                      ) : (
                        <p className="text-global-1 text-lg lg:text-[24px] lg:leading-[26px] font-normal mb-2">
                          {profile?.bio || 'User Bio'}
                        </p>
                      )}
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-global-3 text-white text-sm rounded p-1" placeholder="Location" />
                          <input type="text" value={classYear} onChange={(e) => setClassYear(e.target.value)} className="bg-global-3 text-white text-sm rounded p-1" placeholder="Class Year" />
                          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-global-3 text-white text-sm rounded p-1" placeholder="Username" />
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm lg:text-[16px] lg:leading-[18px]">
                          {profile?.location || 'Location'} • {profile?.class_year || 'Class Year'} • @{profile?.username || 'username'}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleProfileUpdate();
                          }
                          setIsEditing(!isEditing);
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-[20px] transition-colors duration-200 text-sm lg:text-[18px]"
                      >
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-[20px] transition-colors duration-200 text-sm lg:text-[18px]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-global-3 rounded-[20px] p-4 lg:p-6 mb-4">
                    <h3 className="text-global-1 text-lg lg:text-[20px] font-normal mb-2">Bio</h3>
                    {isEditing ? (
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-global-3 text-white w-full rounded p-2" />
                    ) : (
                      <p className="text-global-1 text-sm lg:text-[16px] lg:leading-[20px]">
                        {profile?.bio || 'No bio yet. Click Edit Profile to add one!'}
                      </p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="bg-global-3 rounded-[15px] p-3 lg:p-4 text-center">
                        <div className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-2`}></div>
                        <div className="text-global-1 text-lg lg:text-[24px] font-normal">{stat.value}</div>
                        <div className="text-gray-400 text-xs lg:text-[12px]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column - Personality & Goals */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Personality Traits */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
                  <h3 className="text-global-1 text-xl lg:text-[24px] font-normal mb-4">Personality</h3>
                  <div className="space-y-3">
                    {personalityTraits.map((trait, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-global-1 text-sm lg:text-[16px]">{trait.name}</span>
                          <span className="text-gray-400 text-sm lg:text-[14px]">{trait.value}%</span>
                        </div>
                        <div className="w-full bg-global-3 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${trait.value}%` }}
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

              {/* Right Column - Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
