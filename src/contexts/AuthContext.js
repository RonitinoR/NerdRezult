import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);

  const login = async (method, credentials) => {
    try {
      let response;
      switch (method) {
        case 'email':
          response = await authService.login(credentials);
          break;
        case 'google':
          response = await authService.googleAuth();
          break;
        case 'github':
          response = await authService.githubAuth();
          break;
        default:
          throw new Error('Invalid authentication method');
      }
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('authMethod', method);
        setAuthMethod(method);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authMethod');
    setIsAuthenticated(false);
    setAuthMethod(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      authMethod,
      login,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);