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
        setIsAuthenticated(true);
        setAuthMethod('email');
        return response;
        case 'phone':
          response = await authService.verifyOtp(credentials.phoneNumber, credentials.otp);
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
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('authMethod', method);
        setAuthMethod(method);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error('Invalid authentication response');
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
