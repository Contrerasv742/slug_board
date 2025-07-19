import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchView from '../ui/SearchView';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

const CompleteNavigation = ({ 
  searchValue = '', 
  onSearchChange = () => {}, 
  onSearch = () => {},
  searchPlaceholder = "Search...",
  showSearch = true,
  children 
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFullNav, setShowFullNav] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
      if (showFullNav && !event.target.closest('.full-nav-container')) {
        setShowFullNav(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showMobileMenu, showFullNav]);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleFullNav = () => {
    setShowFullNav(!showFullNav);
  };

  // Complete navigation structure - every page connects to every other page
  const navigationStructure = {
    main: [
      { name: '🏠 Home', path: '/home', description: 'View all events and posts' },
      { name: '➕ Create Event', path: '/create-post', description: 'Create a new event or post' },
      { name: '👤 Profile', path: '/profile', description: 'View and edit your profile' },
      { name: '🗺️ Map', path: '/map', description: 'View events on a map' },
    ],
    auth: [
      { name: '🔐 Login', path: '/login', description: 'Sign in to your account' },
      { name: '📝 Sign Up', path: '/signup', description: 'Create a new account' },
      { name: '🔑 Reset Password', path: '/reset-password', description: 'Reset your password' },
      { name: '✏️ Update Password', path: '/update-password', description: 'Change your password' },
    ],
    user: [
      { name: '⚙️ Settings', path: '/settings', description: 'Account settings' },
      { name: '📊 Dashboard', path: '/dashboard', description: 'User dashboard' },
      { name: '📚 My Events', path: '/my-events', description: 'Events you created' },
      { name: '❤️ Favorites', path: '/favorites', description: 'Your favorite events' },
    ],
    community: [
      { name: '👥 Groups', path: '/groups', description: 'Community groups' },
      { name: '💬 Forums', path: '/forums', description: 'Discussion forums' },
      { name: '📢 Announcements', path: '/announcements', description: 'Campus announcements' },
      { name: '🎓 Resources', path: '/resources', description: 'Student resources' },
    ]
  };

  // Flatten all navigation items for complete graph
  const allNavItems = [
    ...navigationStructure.main,
    ...navigationStructure.auth,
    ...navigationStructure.user,
    ...navigationStructure.community
  ];

  // Filter items based on authentication status
  const getAvailableNavItems = () => {
    if (user) {
      // Authenticated users can access most pages
      return [
        ...navigationStructure.main,
        ...navigationStructure.user,
        ...navigationStructure.community
      ];
    } else {
      // Non-authenticated users can only access auth pages
      return navigationStructure.auth;
    }
  };

  const availableNavItems = getAvailableNavItems();

  return (
    <>
      {/* Header */}
      <header className="bg-global-1 border-b-2 border-white border-opacity-60 p-4 sm:p-6 lg:p-[16px_32px]">
        <div className="flex flex-row items-center justify-between w-full max-w-full mx-auto gap-4 sm:gap-6 lg:gap-8">
          {/* Logo Section */}
          <div className="flex flex-row items-center justify-start flex-shrink-0">
            <Link to="/home" className="flex items-center">
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
            </Link>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4">
              <SearchView
                value={searchValue}
                onChange={onSearchChange}
                onSearch={onSearch}
                placeholder={searchPlaceholder}
                leftIcon="/images/img_search.png"
              />
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Full Navigation Button */}
            <button
              onClick={toggleFullNav}
              className="p-2 text-global-4 hover:bg-global-2 rounded-lg transition-colors full-nav-container"
              title="Complete Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M8 6v12M12 6v12M16 6v12" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden mobile-menu-container">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-global-4 hover:bg-global-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex flex-row items-center justify-end flex-shrink-0 relative user-menu-container">
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[40px] lg:h-[40px] bg-global-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={toggleUserMenu}
              >
                <img
                  src="/images/user-avatar.png"
                  className="w-full h-full object-cover rounded-full"
                  alt="User Avatar"
                />
              </div>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-global-2 rounded-lg shadow-lg border border-global-3 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 text-global-1 hover:bg-global-3 transition-colors rounded-lg"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block w-full text-left px-4 py-2 text-global-1 hover:bg-global-3 transition-colors rounded-lg"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="border-global-3 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full Navigation Overlay */}
      {showFullNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-global-2 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-global-1">Complete Navigation</h2>
                <button
                  onClick={toggleFullNav}
                  className="text-global-4 hover:text-global-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Navigation */}
                <div>
                  <h3 className="text-lg font-semibold text-global-1 mb-3">Main Pages</h3>
                  <div className="space-y-2">
                    {navigationStructure.main.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowFullNav(false)}
                        className={`block p-3 rounded-lg transition-colors ${
                          activeMenuItem === item.path 
                            ? 'bg-global-3 text-global-1' 
                            : 'bg-global-1 text-global-4 hover:bg-global-3 hover:text-global-1'
                        }`}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm opacity-75">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User Pages */}
                {user && (
                  <div>
                    <h3 className="text-lg font-semibold text-global-1 mb-3">User Pages</h3>
                    <div className="space-y-2">
                      {navigationStructure.user.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowFullNav(false)}
                          className={`block p-3 rounded-lg transition-colors ${
                            activeMenuItem === item.path 
                              ? 'bg-global-3 text-global-1' 
                              : 'bg-global-1 text-global-4 hover:bg-global-3 hover:text-global-1'
                          }`}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm opacity-75">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Pages */}
                {user && (
                  <div>
                    <h3 className="text-lg font-semibold text-global-1 mb-3">Community</h3>
                    <div className="space-y-2">
                      {navigationStructure.community.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowFullNav(false)}
                          className={`block p-3 rounded-lg transition-colors ${
                            activeMenuItem === item.path 
                              ? 'bg-global-3 text-global-1' 
                              : 'bg-global-1 text-global-4 hover:bg-global-3 hover:text-global-1'
                          }`}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm opacity-75">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth Pages (for non-authenticated users) */}
                {!user && (
                  <div>
                    <h3 className="text-lg font-semibold text-global-1 mb-3">Authentication</h3>
                    <div className="space-y-2">
                      {navigationStructure.auth.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowFullNav(false)}
                          className={`block p-3 rounded-lg transition-colors ${
                            activeMenuItem === item.path 
                              ? 'bg-global-3 text-global-1' 
                              : 'bg-global-1 text-global-4 hover:bg-global-3 hover:text-global-1'
                          }`}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm opacity-75">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-global-2 border-b border-global-3 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {availableNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 text-global-1 rounded-lg transition-colors
                          ${activeMenuItem === item.path 
                            ? 'bg-global-3 text-global-1' 
                            : 'hover:bg-global-3'
                          }`}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-[16%] bg-global-1 border-r-2 border-white border-opacity-60 p-5">
          <nav className="w-full space-y-2">
            {/* Main Navigation */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-global-4 mb-2 uppercase tracking-wide">Main</h4>
              {navigationStructure.main.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex justify-center items-center p-3 rounded-[10px]
                              transition-all duration-200 lg:h-10
                             border-none cursor-pointer font-normal
                             ${activeMenuItem === item.path 
                               ? 'bg-global-2 text-global-1' 
                               : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                             }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Navigation (if authenticated) */}
            {user && (
              <>
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-global-4 mb-2 uppercase tracking-wide">User</h4>
                  {navigationStructure.user.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex justify-center items-center p-3 rounded-[10px]
                                  transition-all duration-200 lg:h-10
                                 border-none cursor-pointer font-normal
                                 ${activeMenuItem === item.path 
                                   ? 'bg-global-2 text-global-1' 
                                   : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                                 }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-global-4 mb-2 uppercase tracking-wide">Community</h4>
                  {navigationStructure.community.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex justify-center items-center p-3 rounded-[10px]
                                  transition-all duration-200 lg:h-10
                                 border-none cursor-pointer font-normal
                                 ${activeMenuItem === item.path 
                                   ? 'bg-global-2 text-global-1' 
                                   : 'bg-global-1 text-sidebar-1 hover:bg-global-2 hover:text-global-1'
                                 }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex justify-center items-center p-3 rounded-[10px]
                          transition-all duration-200 lg:h-10 w-full
                          border-none cursor-pointer font-normal
                          bg-global-1 text-red-500 hover:bg-red-100 hover:text-red-700"
              >
                Logout
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-6 lg:p-[24px_28px]">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default CompleteNavigation; 