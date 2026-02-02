import { createContext, useContext, useState, useEffect } from 'react';
import { SUPER_ADMIN, SESSION_DURATION_HOURS } from './authConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('pos_auth_user');
        const loginTime = localStorage.getItem('pos_auth_time');
        
        if (storedUser && loginTime) {
          const user = JSON.parse(storedUser);
          const timeDiff = Date.now() - parseInt(loginTime, 10);
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          // Session expires after configured hours
          if (hoursDiff < SESSION_DURATION_HOURS) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // Session expired
            logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (username, password) => {
    // Validate credentials
    if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
      const userData = {
        username: SUPER_ADMIN.username,
        role: SUPER_ADMIN.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('pos_auth_user', JSON.stringify(userData));
      localStorage.setItem('pos_auth_time', Date.now().toString());
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pos_auth_user');
    localStorage.removeItem('pos_auth_time');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};