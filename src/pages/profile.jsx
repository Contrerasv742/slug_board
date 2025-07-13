import React, { useState } from 'react';

const UserProfilePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    { name: 'Home', active: false },
    { name: 'Map', active: false },
    { name: 'Explore', active: false },
    { name: 'Popular', active: false }
  ];

  const personalityTraits = [
    { name: 'Extrovert', value: 85, color: 'bg-red-500' },
    { name: 'Creative', value: 72, color: 'bg-orange-500' },
    { name: 'Analytical', value: 60, color: 'bg-yellow-500' },
    { name: 'Adventurous', value: 90, color: 'bg-green-500' },
    { name: 'Social', value: 78, color: 'bg-blue-500' }
  ];

  const goals = [
    'Connect with fellow UC Santa Cruz students',
    'Organize more campus events'
  ];

  const interests = [
    'Playing with boobies',
    'Pooping',
    'Dudes',
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

  return (
    <div className="flex flex-col min-h-screen bg-global-1 font-ropa">
      {/* Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60
        p-4 sm:p-6 lg:p-[16px_32px]">
        <div className="flex flex-row items-center justify-between w-full
          max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">

          {/* Logo Section */}
          <button 
            onClick={() => window.location.href = '/home'}
            className="flex flex-row items-center justify-start
            flex-shrink-0 bg-transparent border-none cursor-pointer
            hover:opacity-80 transition-opacity duration-200 p-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px]
              lg:h-[40px] bg-global-2 rounded-sm">
              <img
                src="/images/standing-sammy.png"
                className="w-full h-full object-contain"
                alt="Slug mascot"
              />
            </div>
            <h1 className="text-global-4 font-ropa text-lg sm:text-xl
              md:text-2xl lg:text-[28px] lg:leading-[30px] font-normal ml-2
              sm:ml-3 lg:ml-[16px] text-starship-animated">
              Slug Board
            </h1>
          </button>


          {/* Search Bar */}
          <div className="pl-[40px] w-[800px] max-w-[650px] header-search">
            <div className="relative">
              <img
                src="/images/img_search.png"
                alt="search"
                className="absolute left-3 lg:left-4 top-1/2 transform
                -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5"
              />
              <input
                type="text"
                placeholder="Search Posts"
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full h-[40px] bg-global-2 text-global-1
                rounded-[20px] border-none outline-none text-sm sm:text-base
                md:text-lg lg:text-xl lg:leading-[10px] py-[2px] sm:py-[4px]
                lg:py-[2px] pl-10 lg:pl-[45px] placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2
          border-white border-opacity-60 p-5">
          <nav className="flex flex-col gap-6 lg:gap-[2px] w-full">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex justify-center items-center p-3 rounded-[10px]
transition-all duration-200 lg:h-10 border-none cursor-pointer font-normal
${activeMenuItem === item.name 
? 'bg-global-2 text-global-1' 
: 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
}`}
              >
                <span className="text-lg lg:text-3xl lg:leading-[38px]">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Profile Content */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-7xl mx-auto">

            {/* Main Profile Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column - Profile Header Info */}
              <div className="lg:col-span-4">
                <div className="bg-global-2 rounded-[35px] p-6 lg:p-[32px]">
                  <div className="flex flex-col items-center text-center
                    gap-6">

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
                        <h1 className="text-global-1 text-xl lg:text-[28px]
                          lg:leading-[32px] font-normal mb-2">
                          Jamie Silva
                        </h1>
                        <p className="text-global-1 text-base lg:text-[20px]
                          lg:leading-[22px] font-normal mb-2">
                          Computer Science Student
                        </p>
                        <p className="text-gray-400 text-sm lg:text-[14px]
                          lg:leading-[16px]">
                          UC Santa Cruz • Class of 2025 • @jamiesilva
                        </p>
                      </div>

                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full bg-purple-500 hover:bg-purple-600
                        text-white px-6 py-2 lg:px-8 lg:py-3 rounded-[20px]
                        transition-colors duration-200 text-sm lg:text-[18px]
                        mb-4"
                      >
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                      </button>

                      {/* Bio */}
                      <div className="bg-global-3 rounded-[20px] p-4 lg:p-6
                        mb-4">
                        <h3 className="text-global-1 text-lg lg:text-[20px]
                          font-normal mb-1">Bio</h3>
                        <p className="text-global-1 text-sm lg:text-[15px]
                          lg:leading-[20px]">
                          Passionate CS student who loves connecting with
                          fellow Slugs! Always looking for new opportunities to
                          collaborate on projects and organize campus events.
                          Coffee enthusiast and weekend photographer.
                        </p>
                      </div>

                      {/* Quick Stats */}

                      {/* Interests */}
                      <div className="bg-global-3 rounded-[20px] p-4 lg:p-6
                        mb-4">
                        <h3 className="text-global-1 text-lg lg:text-[20px]
                          font-normal mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, index) => (
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
                      </div>

                      {/* Goals */}
                      <div className="bg-global-3 rounded-[25px] p-6 lg:p-[24px]">
                        <h3 className="text-global-1 text-xl lg:text-[20px]
                          font-normal mb-4">Goals</h3>
                        <div className="space-y-3">
                          {goals.map((goal, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full
                                mt-2 flex-shrink-0"></div>
                              <span className="text-global-1 text-sm lg:text-[16px]
                                lg:leading-[20px]">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {/* Right Content Area */}
              <div className="lg:col-span-8 space-y-6">

                {/* Recent Activity */}
                <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
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
                  <div className="bg-global-2 rounded-[25px] p-6 lg:p-[24px]">
                    <h3 className="text-global-1 text-xl lg:text-[24px]
                      font-normal mb-4">Personality</h3>
                    <div className="space-y-3">
                      {personalityTraits.map((trait, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-global-1 text-sm
                              lg:text-[16px]">{trait.name}</span>
                            <span className="text-gray-400 text-sm
                              lg:text-[14px]">{trait.value}%</span>
                          </div>
                          <div className="w-full bg-global-3 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500
                              to-blue-500 h-2 rounded-full transition-all
                              duration-500"
                              style={{ width: `${trait.value}%` }}
                            ></div>
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

export default UserProfilePage;
