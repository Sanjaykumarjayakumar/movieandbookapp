import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if username and password match a registered user
    const foundUser = registeredUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // User found, set as logged in user
      const loggedInUser = { 
        id: foundUser.id,
        username: foundUser.username, 
        profilePhoto: foundUser.profilePhoto || null,
        preferences: foundUser.preferences || {}
      };
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true, message: 'Login successful' };
    }
    
    // Invalid credentials
    return { success: false, message: 'Invalid username or password' };
  };

  const signup = (username, password) => {
    // Get existing registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if username already exists
    const existingUser = registeredUsers.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Create new user account
    if (username && password) {
      const newUser = { 
        id: Date.now().toString(), // Simple ID generation
        username, 
        password,
        profilePhoto: null,
        preferences: {},
        isFirstTime: true // Mark as first time user
      };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Automatically log in the new user
      const loggedInUser = { 
        id: newUser.id,
        username, 
        profilePhoto: null,
        preferences: {},
        isFirstTime: true
      };
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true, message: 'Account created successfully' };
    }
    
    return { success: false, message: 'Please fill in all fields' };
  };

  const uploadProfilePhoto = (file) => {
    if (!user) return { success: false, message: 'User not logged in' };

    // Convert file to base64 for localStorage storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const profilePhoto = e.target.result;
      const updatedUser = { ...user, profilePhoto };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Also update in registeredUsers
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        registeredUsers[userIndex].profilePhoto = profilePhoto;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
    };
    reader.readAsDataURL(file);
    
    return { success: true, message: 'Profile photo uploaded successfully' };
  };

  const updatePreferences = (preferences) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const updatedUser = { ...user, preferences, isFirstTime: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Also update in registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      registeredUsers[userIndex].preferences = preferences;
      registeredUsers[userIndex].isFirstTime = false;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    return { success: true, message: 'Preferences updated successfully' };
  };

  const addToWatchlist = (movie) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const watchlistKey = `watchlist_${user.id}`;
    const watchlist = JSON.parse(localStorage.getItem(watchlistKey) || '[]');
    
    // Check if movie already exists
    if (watchlist.some(m => m.id === movie.id)) {
      return { success: false, message: 'Movie already in watchlist' };
    }

    watchlist.push(movie);
    localStorage.setItem(watchlistKey, JSON.stringify(watchlist));
    return { success: true, message: 'Movie added to watchlist' };
  };

  const removeFromWatchlist = (movieId) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const watchlistKey = `watchlist_${user.id}`;
    const watchlist = JSON.parse(localStorage.getItem(watchlistKey) || '[]');
    const updatedWatchlist = watchlist.filter(m => m.id !== movieId);
    localStorage.setItem(watchlistKey, JSON.stringify(updatedWatchlist));
    return { success: true, message: 'Movie removed from watchlist' };
  };

  const getWatchlist = () => {
    if (!user) return [];
    const watchlistKey = `watchlist_${user.id}`;
    return JSON.parse(localStorage.getItem(watchlistKey) || '[]');
  };

  const addToReadLater = (book) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const readLaterKey = `readLater_${user.id}`;
    const readLater = JSON.parse(localStorage.getItem(readLaterKey) || '[]');
    
    // Check if book already exists
    if (readLater.some(b => b.id === book.id)) {
      return { success: false, message: 'Book already in read later' };
    }

    readLater.push(book);
    localStorage.setItem(readLaterKey, JSON.stringify(readLater));
    return { success: true, message: 'Book added to read later' };
  };

  const removeFromReadLater = (bookId) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const readLaterKey = `readLater_${user.id}`;
    const readLater = JSON.parse(localStorage.getItem(readLaterKey) || '[]');
    const updatedReadLater = readLater.filter(b => b.id !== bookId);
    localStorage.setItem(readLaterKey, JSON.stringify(updatedReadLater));
    return { success: true, message: 'Book removed from read later' };
  };

  const getReadLater = () => {
    if (!user) return [];
    const readLaterKey = `readLater_${user.id}`;
    return JSON.parse(localStorage.getItem(readLaterKey) || '[]');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { 
    user, 
    loading, 
    login, 
    signup, 
    logout, 
    uploadProfilePhoto, 
    updatePreferences,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    addToReadLater,
    removeFromReadLater,
    getReadLater
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
