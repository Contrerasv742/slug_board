import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import General Pages
import LoginPage from './pages/general/login.jsx';
import HomePage from './pages/general/home.jsx';
import ExplorePage from './pages/general/explore.jsx';
import PopularPage from './pages/general/popular.jsx';
import MapPage from './pages/general/map.jsx';

// Import User Pages
import UserCreationPage from './pages/user/create.jsx';
import UserProfilePage from './pages/user/profile.jsx';

// Import Post Pages
import CreatePostPage from './pages/post/create.jsx';
import PostDetailPage from './pages/post/view.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Feeds */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/explore" element={<ExplorePage/>} />
        <Route path="/popular" element={<PopularPage/>} />

        {/* Post Pages */}
        <Route path="/post" element={<PostDetailPage/>} />
        <Route path="/create-post" element={<CreatePostPage/>} />

        {/* User Interactable */}
        <Route path="/profile" element={<UserProfilePage/>} />
        <Route path="/create-new-user" element={<UserCreationPage/>} />

        {/* Other */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
