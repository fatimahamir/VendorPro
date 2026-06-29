import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!localStorage.getItem('token'));

  // Only fetch profile if we have token but no user (e.g., page refresh)
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Now returns user data
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      
      const { token: newToken, _id, name, email: userEmail, role } = response.data;
      const userData = { _id, name, email: userEmail, role };
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // ✅ Return user data so Login.jsx can redirect based on role
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // ✅ UPDATED: Now returns user data
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('/auth/register', { 
        name, email, password, role 
      });
      
      const { token: newToken, _id, email: userEmail, role: userRole } = response.data;
      const userData = { _id, name, email: userEmail, role: userRole };
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      // ✅ Return user data so Register.jsx can redirect based on role
      return { success: true, user: userData };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout,
      isAdmin: user?.role === 'admin',
      isVendor: user?.role === 'vendor'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);