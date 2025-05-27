
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    bio: 'Platform administrator',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    bio: 'Tech enthusiast and blogger',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('blogAuth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setAuthState(parsed);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      const newAuthState = {
        user,
        isAuthenticated: true,
        token: 'mock-token-' + user.id
      };
      setAuthState(newAuthState);
      localStorage.setItem('blogAuth', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      role: 'user',
      bio: '',
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    const newAuthState = {
      user: newUser,
      isAuthenticated: true,
      token: 'mock-token-' + newUser.id
    };
    setAuthState(newAuthState);
    localStorage.setItem('blogAuth', JSON.stringify(newAuthState));
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null
    });
    localStorage.removeItem('blogAuth');
  };

  const updateUser = (user: User) => {
    const newAuthState = {
      ...authState,
      user
    };
    setAuthState(newAuthState);
    localStorage.setItem('blogAuth', JSON.stringify(newAuthState));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
