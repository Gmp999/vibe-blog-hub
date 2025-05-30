
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
        // Fetch user profile from our profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as 'admin' | 'user',
            bio: profile.bio || '',
            avatar: profile.avatar_url,
            createdAt: profile.created_at
          };
          
          setAuthState({
            user: userData,
            isAuthenticated: true,
            token: session.access_token
          });
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile from our profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as 'admin' | 'user',
            bio: profile.bio || '',
            avatar: profile.avatar_url,
            createdAt: profile.created_at
          };
          
          setAuthState({
            user: userData,
            isAuthenticated: true,
            token: session.access_token
          });
        }
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
        console.error('Signup error:', error);
        return false;
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
  };

  const updateUser = async (user: User) => {
    // Update profile in database
    const { error } = await supabase
      .from('profiles')
      .update({
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (!error) {
      setAuthState(prev => ({
        ...prev,
        user
      }));
    }
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
