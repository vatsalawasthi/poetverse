import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import CreatePoemPage from './pages/CreatePoemPage';
import CollabStudioPage from './pages/CollabStudioPage';
import MatchmakerPage from './pages/MatchmakerPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-1 pb-16">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/create" element={<CreatePoemPage />} />
                <Route path="/collab" element={<CollabStudioPage />} />
                <Route path="/matchmaker" element={<MatchmakerPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
              </Routes>
            </main>

            {/* Global Auth Modal */}
            <AuthModal />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
