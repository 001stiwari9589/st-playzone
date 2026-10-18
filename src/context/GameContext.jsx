import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, saveProfile, getStats, getUnlockedAchievements } from '../utils/storage';
import { authAPI, scoresAPI } from '../utils/api';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [profile, setProfile] = useState(getProfile());
  const [stats, setStats] = useState(getStats());
  const [unlockedAchievements, setUnlockedAchievements] = useState(getUnlockedAchievements());
  const [toasts, setToasts] = useState([]);

  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('st_auth_token') || null);
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load authenticated user profile on initial mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('st_auth_token');
      if (!storedToken) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        if (data.user) {
          setAuthUser(data.user);
          setProfile((prev) => ({
            ...prev,
            username: data.user.username,
            avatar: data.user.avatar || '🎮',
            tagline: data.user.tagline || prev.tagline,
            points: data.user.points,
            level: data.user.level,
            gamesPlayed: data.user.gamesPlayed,
            quizzesCompleted: data.user.quizzesCompleted
          }));
        }
      } catch (err) {
        console.warn('Session expired or backend offline:', err.message);
        localStorage.removeItem('st_auth_token');
        setToken(null);
        setAuthUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  // Listen for local profile updates and toasts
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail?.profile) {
        setProfile(e.detail.profile);
      }
      setStats(getStats());
      setUnlockedAchievements(getUnlockedAchievements());

      if (e.detail?.toast) {
        const id = Date.now() + Math.random();
        const newToast = { id, ...e.detail.toast };
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
      }
    };

    window.addEventListener('st_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('st_profile_updated', handleProfileUpdate);
  }, []);

  // Login action
  const login = async (emailOrUsername, password) => {
    const data = await authAPI.login({ emailOrUsername, password });
    if (data.token && data.user) {
      localStorage.setItem('st_auth_token', data.token);
      setToken(data.token);
      setAuthUser(data.user);
      
      const updatedProfile = saveProfile({
        username: data.user.username,
        avatar: data.user.avatar,
        tagline: data.user.tagline,
        points: data.user.points
      });
      setProfile(updatedProfile);

      // Toast alert
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, title: `Welcome back, ${data.user.username}!`, message: 'Signed in successfully with MongoDB' }
      ]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);

      return data.user;
    }
  };

  // Register action
  const register = async ({ username, email, password, avatar }) => {
    const data = await authAPI.register({ username, email, password, avatar });
    if (data.token && data.user) {
      localStorage.setItem('st_auth_token', data.token);
      setToken(data.token);
      setAuthUser(data.user);

      const updatedProfile = saveProfile({
        username: data.user.username,
        avatar: data.user.avatar,
        tagline: data.user.tagline,
        points: data.user.points
      });
      setProfile(updatedProfile);

      // Toast alert
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        { id, title: `Account Created!`, message: `Welcome to ST PlayZone, ${data.user.username}! (+50 Starter Points)` }
      ]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);

      return data.user;
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('st_auth_token');
    setToken(null);
    setAuthUser(null);
    const localProfile = getProfile();
    setProfile(localProfile);

    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, title: 'Logged Out', message: 'You are now playing in offline demo mode.' }
    ]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // Update profile action (both local & backend)
  const updateUserProfile = async (updates) => {
    const updatedLocal = saveProfile(updates);
    setProfile(updatedLocal);

    if (token && authUser) {
      try {
        const res = await authAPI.updateProfile(updates);
        if (res.user) {
          setAuthUser(res.user);
        }
      } catch (err) {
        console.warn('Backend profile sync failed:', err.message);
      }
    }
    return updatedLocal;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <GameContext.Provider value={{
      profile,
      stats,
      unlockedAchievements,
      toasts,
      removeToast,
      token,
      authUser,
      isAuthenticated: Boolean(token && authUser),
      isAuthLoading,
      login,
      register,
      logout,
      updateUserProfile
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
