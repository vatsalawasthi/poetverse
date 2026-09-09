import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Defaults to null (Guest) unless the user has authenticated with their personal credentials
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('poetverse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('poetverse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('poetverse_user');
    }
  }, [currentUser]);

  const login = async (username, password) => {
    if (!username?.trim() || !password?.trim()) {
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    try {
      const res = await authAPI.login({ 
        username: username.trim(), 
        password: password.trim() 
      });
      setCurrentUser(res.data);
      setIsAuthModalOpen(false);
      return { success: true, user: res.data };
    } catch (err) {
      // Strict rejection: Never allow unauthorized access
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : (err.response?.data?.message || 'Invalid username/email or password.');
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    if (!userData.username?.trim() || !userData.email?.trim() || !userData.password?.trim()) {
      return { success: false, error: 'Username, email, and password are required.' };
    }

    try {
      const res = await authAPI.register({
        ...userData,
        username: userData.username.trim().toLowerCase().replace(/\s+/g, '_'),
        email: userData.email.trim().toLowerCase(),
        password: userData.password.trim(),
        displayName: userData.displayName?.trim() || userData.username.trim(),
      });
      setCurrentUser(res.data);
      setIsAuthModalOpen(false);
      return { success: true, user: res.data };
    } catch (err) {
      const errorMessage = typeof err.response?.data === 'string'
        ? err.response.data
        : (err.response?.data?.message || 'Registration failed. Username or email may already be registered.');
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('poetverse_user');
  };

  const openRegisterModal = () => {
    setAuthModalInitialMode('register');
    setIsAuthModalOpen(true);
  };

  const openLoginModal = () => {
    setAuthModalInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const toggleFollow = async (targetUserId) => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    try {
      await userAPI.toggleFollow(targetUserId, currentUser.id);
    } catch (e) {
      // error handled
    }
    
    setCurrentUser(prev => {
      if (!prev) return prev;
      const followingList = Array.isArray(prev.following) ? prev.following : Array.from(prev.following || []);
      const isFollowing = followingList.includes(targetUserId);
      const newFollowing = isFollowing 
        ? followingList.filter(id => id !== targetUserId)
        : [...followingList, targetUserId];
      return { ...prev, following: newFollowing };
    });
  };

  const toggleBookmark = async (poemId) => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    try {
      await userAPI.toggleBookmark(currentUser.id, poemId);
    } catch (e) {
      // error handled
    }

    setCurrentUser(prev => {
      if (!prev) return prev;
      const bookmarked = Array.isArray(prev.bookmarkedPoemIds) 
        ? prev.bookmarkedPoemIds 
        : Array.from(prev.bookmarkedPoemIds || []);
      const isBookmarked = bookmarked.includes(poemId);
      const newBookmarks = isBookmarked 
        ? bookmarked.filter(id => id !== poemId)
        : [...bookmarked, poemId];
      return { ...prev, bookmarkedPoemIds: newBookmarks };
    });
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    try {
      const res = await userAPI.updateProfile(currentUser.id, updatedData);
      setCurrentUser(res.data);
    } catch (e) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        authModalInitialMode,
        openAuthModal: () => openLoginModal(),
        openRegisterModal,
        openLoginModal,
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        logout,
        toggleFollow,
        toggleBookmark,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
