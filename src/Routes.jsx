import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/general/login.jsx';
import SignupPage from './pages/signup.jsx';
import HomePage from './pages/general/home.jsx';
import CreatePostPage from './pages/post/create.jsx';
import MapPage from './pages/general/map.jsx';
import UserProfilePage from './pages/user/profile.jsx';
import ResetPasswordPage from './pages/reset-password.jsx';
import UpdatePasswordPage from './pages/update-password.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
        />
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        
        {/* Additional routes for complete navigation graph */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Settings</h1>
                  <p className="text-global-1">Settings page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Dashboard</h1>
                  <p className="text-global-1">Dashboard page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-events" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">My Events</h1>
                  <p className="text-global-1">My Events page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Favorites</h1>
                  <p className="text-global-1">Favorites page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Groups</h1>
                  <p className="text-global-1">Groups page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forums" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Forums</h1>
                  <p className="text-global-1">Forums page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/announcements" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Announcements</h1>
                  <p className="text-global-1">Announcements page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-global-1 flex items-center justify-center">
                <div className="bg-global-2 p-8 rounded-lg">
                  <h1 className="text-2xl font-bold text-global-1 mb-4">Resources</h1>
                  <p className="text-global-1">Resources page coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
