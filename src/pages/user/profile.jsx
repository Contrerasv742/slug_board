import React, { useState } from 'react';
import Header from '../../components/common/Header.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // User data state
  const [userData, setUserData] = useState({
    name: 'Jamie Silva',
    title: 'Computer Science Student',
    bio: 'Passionate CS student who loves connecting with fellow Slugs! Always looking for new opportunities to collaborate on projects and organize campus events. Coffee enthusiast and weekend photographer.',
    interests: ['Playing with boobies', 'Pooping', 'Dudes'],
    goals: [
      'Connect with fellow UC Santa Cruz students',
      'Organize more campus events'
    ],
    personalityTraits: [
      { name: 'Extrovert', value: 9, color: 'bg-red-500' },
      { name: 'Creative', value: 7, color: 'bg-orange-500' },
      { name: 'Analytical', value: 6, color: 'bg-yellow-500' },
      { name: 'Adventurous', value: 10, color: 'bg-green-500' },
      { name: 'Social', value: 8, color: 'bg-blue-500' }
    ]
  });

  // Temporary editing state
  const [editData, setEditData] = useState({});
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [interestSearch, setInterestSearch] = useState('');

  const predefinedInterests = [
    'Photography', 'Coding', 'Music', 'Sports', 'Art', 'Reading',
    'Gaming', 'Travel', 'Food', 'Fitness', 'Movies', 'Nature',
    'Dancing', 'Writing', 'Cooking', 'Science', 'Technology', 'Fashion',
    'Theater', 'Volunteering', 'Hiking', 'Meditation', 'Languages', 'History'
  ];

  const recentPosts = [
    {
      title: 'Photography Club Meetup',
      description: 'Join us for a sunset photo walk around campus',
      upvotes: 124,
      timeAgo: '2 days ago'
    },
    {
      title: 'Study Group Formation',
      description: 'Looking for CS students for algorithm study sessions',
      upvotes: 89,
      timeAgo: '1 week ago'
    },
    {
      title: 'Campus Coffee Recommendations',
      description: 'Best spots for coffee and studying on campus',
      upvotes: 156,
      timeAgo: '2 weeks ago'
    }
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData(prev => ({
        ...prev,
        ...editData
      }));
      setEditData({});
      setNewInterest('');
      setNewGoal('');
      setInterestSearch('');
    } else {
      // Initialize edit data
      setEditData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = (interest) => {
    const currentInterests = editData.interests || userData.interests;
    if (interest && !currentInterests.includes(interest)) {
      setEditData(prev => ({
        ...prev,
        interests: [...currentInterests, interest]
      }));
      setInterestSearch('');
    }
  };

  const removeInterest = (index) => {
    const currentInterests = editData.interests || userData.interests;
    if (currentInterests.length > 3) {
      setEditData(prev => ({
        ...prev,
        interests: currentInterests.filter((_, i) => i !== index)
      }));
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setEditData(prev => ({
        ...prev,
        goals: [...(prev.goals || userData.goals), newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (index) => {
    setEditData(prev => ({
      ...prev,
      goals: (prev.goals || userData.goals).filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (index, value) => {
    const newGoals = [...(editData.goals || userData.goals)];
    newGoals[index] = value;
    setEditData(prev => ({
      ...prev,
      goals: newGoals
    }));
  };

  const handleTraitChange = (index, value) => {
    const newTraits = [...(editData.personalityTraits || userData.personalityTraits)];
    newTraits[index] = { ...newTraits[index], value: parseInt(value) };
    setEditData(prev => ({
      ...prev,
      personalityTraits: newTraits
    }));
  };

  const currentData = isEditing ? { ...userData, ...editData } : userData;

  // Filter interests based on search and exclude already selected ones
  const filteredInterests = predefinedInterests.filter(interest =>
    interest.toLowerCase().includes(interestSearch.toLowerCase()) &&
    !(currentData.interests || []).includes(interest)
  );

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <Header 
        showSearch={true}
        searchPlaceholder="Search Posts"
        userName="John Doe"
        userHandle="@johndoe"
        userAvatar="/images/default-avatar.png"
      />

      {/* Main Content */}
      <div className="flex flex-1 pt-16 sm:pt-18 lg:pt-24"> 
        {/* Sidebar */}
        <Sidebar/>

        {/* Profile Content */}
        <main className="flex-1 p-6 sm:p-6 lg:pl-[16%] lg:p-[24px_28px]">
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
                          JS
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-5 h-5
                        bg-green-500 rounded-full border-3
                        border-global-2"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="w-full">
                      <div className="mb-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={currentData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="w-full text-xl lg:text-[28px]
                                lg:leading-[32px] font-normal text-center 
                                bg-global-3 border border-gray-200 rounded-[15px] 
                                px-3 py-2 text-global-1 focus:outline-none 
                                focus:ring-2 focus:ring-purple-500"
                              placeholder="Full Name"
                            />
                            <input
                              type="text"
                              value={currentData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className="w-full text-base lg:text-[20px]
                                lg:leading-[22px] font-normal text-center 
                                bg-global-3 border border-gray-200 rounded-[15px] 
                                px-3 py-2 text-global-1 focus:outline-none 
                                focus:ring-2 focus:ring-purple-500"
                              placeholder="Title/Position"
                            />
                          </div>
                        ) : (
                          <>
                            <h1 className="text-global-1 text-xl lg:text-[28px]
                              lg:leading-[32px] font-normal mb-2">
                              {currentData.name}
                            </h1>
                            <p className="text-global-1 text-base lg:text-[20px]
                              lg:leading-[22px] font-normal mb-2">
                              {currentData.title}
                            </p>
                          </>
                        )}
                        <p className="text-gray-400 text-sm lg:text-[14px]
                          lg:leading-[16px]">
                          UC Santa Cruz • Class of 2025 • @jamiesilva
                        </p>
                      </div>

                      <button
                        onClick={handleEditToggle}
                        className="w-full bg-purple-500 hover:bg-purple-600
                        text-white px-6 py-2 lg:px-8 lg:py-3 rounded-[20px]
                        transition-colors duration-200 text-sm lg:text-[18px]
                        mb-4"
                      >
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                      </button>

                      {/* Bio */}
                      <div className="bg-global-3 rounded-[20px] p-4 lg:p-6 mb-4">
                        <h3 className="text-global-1 text-lg lg:text-[20px]
                          font-normal mb-1">Bio</h3>
                        {isEditing ? (
                          <textarea
                            value={currentData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full bg-global-2 border border-gray-200 
                              rounded-[15px] px-3 py-2 text-sm lg:text-[15px] 
                              lg:leading-[20px] text-global-1 resize-none 
                              focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="text-global-1 text-sm lg:text-[15px]
                            lg:leading-[20px]">
                            {currentData.bio}
                          </p>
                        )}
                      </div>

                      {/* Interests */}
                      <div className="bg-global-3 rounded-[20px] p-4 lg:p-6 mb-4">
                        <h3 className="text-global-1 text-lg lg:text-[20px]
                          font-normal mb-3">Interests</h3>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {(currentData.interests || []).map((interest, index) => (
                                <div key={index} className="flex items-center
                                  bg-gradient-to-r from-purple-500 to-blue-500
                                  text-white px-3 py-1 rounded-full text-xs
                                  lg:text-[14px]">
                                  <span>{interest}</span>
                                  {currentData.interests.length > 3 && (
                                    <button
                                      onClick={() => removeInterest(index)}
                                      className="ml-2 text-white hover:text-red-200 font-bold"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={interestSearch}
                                onChange={(e) => setInterestSearch(e.target.value)}
                                placeholder="Search interests..."
                                className="w-full bg-global-2 border border-gray-200 
                                  rounded-[15px] px-3 py-2 text-xs lg:text-[14px] 
                                  text-global-1 focus:outline-none focus:ring-2 
                                  focus:ring-purple-500"
                              />
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {filteredInterests.map(interest => (
                                  <button
                                    key={interest}
                                    onClick={() => addInterest(interest)}
                                    className="px-3 py-1 rounded-full text-xs lg:text-[14px] 
                                      bg-gray-200 text-gray-700 hover:bg-gray-300 
                                      transition-colors"
                                  >
                                    + {interest}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {currentData.interests.length < 3 && (
                              <p className="text-red-400 text-xs">Minimum of 3
                                interests required</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {currentData.interests.map((interest, index) => (
                              <span 
                                key={index} 
                                className="bg-gradient-to-r from-purple-500
                                to-blue-500 text-white px-3 py-1 rounded-full
                                text-xs lg:text-[14px]"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Goals */}
                      <div className="bg-global-3 rounded-[25px] p-6 lg:p-[24px]">
                        <h3 className="text-global-1 text-xl lg:text-[20px]
                          font-normal mb-4">Goals</h3>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              {(currentData.goals || []).map((goal, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500
                                    rounded-full flex-shrink-0"></div>
                                  <input
                                    type="text"
                                    value={goal}
                                    onChange={(e) => updateGoal(index, e.target.value)}
                                    className="flex-1 bg-global-2 border border-gray-200 
                                      rounded-[15px] px-2 py-1 text-sm lg:text-[16px] 
                                      lg:leading-[20px] text-global-1 focus:outline-none 
                                      focus:ring-2 focus:ring-purple-500"
                                  />
                                  <button
                                    onClick={() => removeGoal(index)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                placeholder="Add new goal"
                                className="flex-1 bg-global-2 border border-gray-200 
                                  rounded-[15px] px-3 py-1 text-sm lg:text-[16px] 
                                  lg:leading-[20px] text-global-1 focus:outline-none 
                                  focus:ring-2 focus:ring-purple-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addGoal();
                                  }
                                }}
                              />
                              <button
                                onClick={addGoal}
                                className="bg-purple-500 text-white px-3 py-1
                                rounded-[15px] text-sm lg:text-[16px]
                                hover:bg-purple-600"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {currentData.goals.map((goal, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full
                                  mt-2 flex-shrink-0"></div>
                                <span className="text-global-1 text-sm lg:text-[16px]
                                  lg:leading-[20px]">{goal}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-8 space-y-8 h-full">

                {/* Recent Activity */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[32px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-global-1 text-xl lg:text-[24px]
                      font-normal">Recent Posts</h3>
                    <button className="text-purple-400 hover:text-purple-300
                      text-sm lg:text-[16px]">
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {recentPosts.map((post, index) => (
                      <div key={index} className="bg-global-3 rounded-[20px]
                        p-4 lg:p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-global-1 text-lg lg:text-[20px]
                            font-normal">{post.title}</h4>
                          <span className="text-gray-400 text-xs lg:text-[12px]
                            flex-shrink-0 ml-4">{post.timeAgo}</span>
                        </div>
                        <p className="text-global-1 text-sm lg:text-[16px]
                          lg:leading-[20px] mb-3">{post.description}</p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 bg-global-2
                            rounded-[10px] px-3 py-1">
                            <img 
                              src="/images/img_arrow.png"
                              alt="upvote"
                              className="w-4 h-4"
                            />
                            <span className="text-global-1 text-sm
                              lg:text-[16px]">{post.upvotes}</span>
                          </div>
                          <button className="text-purple-400
                            hover:text-purple-300 text-sm lg:text-[14px]">
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
                  <div className="space-y-[21px]">
                    {currentData.personalityTraits.map((trait, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-global-1 text-sm
                            lg:text-[16px]">{trait.name}</span>
                          <span className="text-gray-400 text-sm
                            lg:text-[14px]">{trait.value}/10</span>
                        </div>
                        {isEditing ? (
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-global-3 rounded-full h-2 relative">
                              <div 
                                className="bg-gradient-to-r from-purple-500
                                to-blue-500 h-2 rounded-full transition-all
                                duration-300"
                                style={{ width: `${trait.value * 10}%` }}
                              ></div>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={trait.value}
                              onChange={(e) => handleTraitChange(index, e.target.value)}
                              className="w-20 h-2 bg-global-3 rounded-lg
                              appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #8b5cf6
                                  0%, #3b82f6 ${trait.value * 10 - 20}%,
                                  #e5e7eb ${trait.value * 10}%, #e5e7eb
                                  100%)`
                              }}
                            />
                            <style>{`
                              input[type="range"]::-webkit-slider-thumb {
                                appearance: none;
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                                cursor: pointer;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                              }
                              input[type="range"]::-moz-range-thumb {
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: linear-gradient(45deg, #8b5cf6, #3b82f6);
                                cursor: pointer;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                border: none;
                              }
                            `}</style>
                          </div>
                        ) : (
                          <div className="w-full bg-global-3 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500
                              to-blue-500 h-2 rounded-full transition-all
                              duration-500"
                              style={{ width: `${trait.value * 10}%` }}
                            ></div>
                          </div>
                        )}
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

export default UserProfilePage;
