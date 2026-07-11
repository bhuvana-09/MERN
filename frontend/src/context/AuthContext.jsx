/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('som_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('som_token');
      localStorage.removeItem('som_user');
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('som_token') || null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem('som_token', tokenValue);
    localStorage.setItem('som_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('som_token');
    localStorage.removeItem('som_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
