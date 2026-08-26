import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const FALLBACK_PERSONAS = [
  {
    id: 'user_vatsal',
    username: 'vatsal_poet',
    displayName: 'Vatsal Awasthi',
    email: 'vatsal@poetverse.io',
    bio: 'Exploring the intersection of modern verse, cosmic philosophy, and spontaneous rhythm.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    location: 'New Delhi, India',
    interestGenres: ['Free Verse', 'Sonnets', 'Spoken Word', 'Philosophy'],
    favoriteThemes: ['Cosmos', 'Philosophy', 'Love', 'Melancholy'],
    followers: ['user_elena'],
    following: ['user_elena', 'user_malik'],
    bookmarkedPoemIds: [],
    badges: ['Pioneer Poet', 'Co-Author Pioneer'],
  },
  {
    id: 'user_elena',
    username: 'elena_solis',
    displayName: 'Elena Solis',
    email: 'elena@poetverse.io',
    bio: 'Weaver of midnight sonnets, classical romanticism, and whispers of the Andalusian wind.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    location: 'Granada, Spain',
    interestGenres: ['Sonnets', 'Romanticism', 'Elegies', 'Free Verse'],
    favoriteThemes: ['Melancholy', 'Love', 'Stars', 'Nostalgia'],
    followers: ['user_vatsal', 'user_zoya'],
    following: ['user_zoya', 'user_vatsal'],
    bookmarkedPoemIds: [],
    badges: ['Master Sonneteer', 'Crown Poet 2026'],
  },
  {
    id: 'user_malik',
    username: 'malik_spoken',
    displayName: 'Malik Vance',
    email: 'malik@poetverse.io',
    bio: 'Spoken word artist & rhythm architect. Translating urban pavement into fire and cadence.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    location: 'Chicago, USA',
    interestGenres: ['Spoken Word', 'Slam Poetry', 'Beat Poetry'],
    favoriteThemes: ['Resistance', 'Urban', 'Identity', 'Hope'],
    followers: ['user_vatsal'],
    following: [],
    bookmarkedPoemIds: [],
    badges: ['Slam Champion', 'Rhythm Architect'],
  },
  {
    id: 'user_zoya',
    username: 'zoya_mir',
    displayName: 'Zoya Mir',
    email: 'zoya@poetverse.io',
    bio: 'Penning contemporary Ghazals and mystic verses on longing, moonlight, and timeless truth.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    location: 'Lahore, Pakistan',
    interestGenres: ['Ghazal', 'Sufi & Mystic', 'Romanticism'],
    favoriteThemes: ['Love', 'Philosophy', 'Longing', 'Moonlight'],
    followers: ['user_elena'],
    following: ['user_elena'],
    bookmarkedPoemIds: [],
    badges: ['Ghazal Virtuoso', 'Verse Weaver'],
  }
];

export const AuthProvider = ({ children }) => {
  // Defaults to null (Guest) unless the user has logged in or registered on this device
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('poetverse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [personas, setPersonas] = useState(FALLBACK_PERSONAS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState('register'); // 'login' or 'register'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('poetverse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('poetverse_user');
    }
  }, [currentUser]);

  // Fetch live personas from backend if available
  useEffect(() => {
    authAPI.getPersonas()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPersonas(res.data);
          // sync current user if matching ID found
          if (currentUser) {
            const matched = res.data.find(u => u.id === currentUser?.id || u.username === currentUser?.username);
            if (matched) setCurrentUser(matched);
          }
        }
      })
      .catch(() => {
        // Backend offline fallback
      });
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authAPI.login({ username, password });
      setCurrentUser(res.data);
      setIsAuthModalOpen(false);
      return { success: true, user: res.data };
    } catch (err) {
      // Fallback local match
      const matched = personas.find(p => 
        p.username.toLowerCase() === username.toLowerCase() || 
        p.email.toLowerCase() === username.toLowerCase()
      );
      if (matched) {
        setCurrentUser(matched);
        setIsAuthModalOpen(false);
        return { success: true, user: matched };
      }
      return { success: false, error: err.response?.data || 'Invalid username or password' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      setCurrentUser(res.data);
      setIsAuthModalOpen(false);
      return { success: true, user: res.data };
    } catch (err) {
      // Local registration fallback
      const newUser = {
        id: 'user_' + Date.now(),
        ...userData,
        followers: [],
        following: [],
        bookmarkedPoemIds: [],
        badges: ['Novice Bard'],
      };
      setCurrentUser(newUser);
      setPersonas(prev => [newUser, ...prev]);
      setIsAuthModalOpen(false);
      return { success: true, user: newUser };
    }
  };

  const switchPersona = (persona) => {
    setCurrentUser(persona);
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
      openRegisterModal();
      return;
    }
    try {
      await userAPI.toggleFollow(targetUserId, currentUser.id);
    } catch (e) {
      // local toggle
    }
    
    setCurrentUser(prev => {
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
      openRegisterModal();
      return;
    }
    try {
      await userAPI.toggleBookmark(currentUser.id, poemId);
    } catch (e) {
      // local toggle
    }

    setCurrentUser(prev => {
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
        personas,
        isAuthModalOpen,
        authModalInitialMode,
        openAuthModal: () => openLoginModal(),
        openRegisterModal,
        openLoginModal,
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        logout,
        switchPersona,
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
