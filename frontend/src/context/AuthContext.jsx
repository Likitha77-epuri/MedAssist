import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Dark Mode state from localStorage or system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Check login status on load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/profile');
          setUser(res.data);
        } catch (err) {
          console.error("Invalid token. Logging out.");
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    
    // Fetch detailed profile after login
    const profileRes = await api.get('/profile');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const register = async (email, password, fullName) => {
    const res = await api.post('/register', {
      email,
      password,
      full_name: fullName,
      role: 'user'
    });
    localStorage.setItem('token', res.data.token);
    
    // Fetch profile
    const profileRes = await api.get('/profile');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/profile', profileData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
