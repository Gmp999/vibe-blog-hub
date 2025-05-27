
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
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
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'user',
          bio: '',
          createdAt: session.user.created_at
        };
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          token: session.access_token
        });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'user',
          bio: '',
          createdAt: session.user.created_at
        };
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          token: session.access_token
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          token: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to mock authentication
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
        console.error('Login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        // Fallback to mock signup
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
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
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
      loginWithGoogle,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
