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

  const login = (email, password) => {
    // Mock login logic: allow any non-empty email/password
    if (email && password) {
      const mockUser = { email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    // Mock signup logic
    if (name && email && password) {
        const mockUser = { email, name };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
    }
    return false;
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
