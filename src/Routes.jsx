import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LoginPage from './pages/login.jsx';
import HomePage from './pages/home.jsx';
import CreatePostPage from './pages/create-post.jsx';
import MapPage from './pages/map.jsx';
import UserProfilePage from './pages/profile.jsx';
import PostDetailPage from './pages/post.jsx';
import UserCreationPage from './pages/user-creation.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        /* Feeds */
        <Route path="/" element={<HomePage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/explore" element={<HomePage/>} />
        <Route path="/popular" element={<HomePage/>} />

        /* Post Pages */
        <Route path="/post" element={<PostDetailPage/>} />
        <Route path="/create-post" element={<CreatePostPage/>} />

        /* User Interactable */
        <Route path="/profile" element={<UserProfilePage/>} />
        <Route path="/creation" element={<UserCreationPage/>} />

        /* Other */
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
