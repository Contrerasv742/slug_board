import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LoginPage from './pages/login.jsx';
import HomePage from './pages/home.jsx';
import CreatePostPage from './pages/create-post.jsx';
import MapPage from './pages/map.jsx';
import UserProfilePage from './pages/profile.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/profile" element={<UserProfilePage/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
