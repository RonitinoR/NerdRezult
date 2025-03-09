import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);

  const login = async (method, credentials) => {
    try {
      switch (method) {
        case 'email':
          const response = await authService.login(credentials);
          setIsAuthenticated(true);
          setAuthMethod('email');
          return response;
        case 'phone':
          const phoneResponse = await authService.verifyOtp(credentials.phoneNumber, credentials.otp);
          if (phoneResponse.access_token) {
            setIsAuthenticated(true);
            setAuthMethod('phone');
            return phoneResponse;
          }
          break;
        case 'google':
          await authService.googleAuth();
          // The function won't return as we're redirecting
          break;
        case 'github':
          await authService.githubAuth();
          // The function won't return as we're redirecting
          break;
        default:
          throw new Error('Invalid authentication method');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authMethod, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
