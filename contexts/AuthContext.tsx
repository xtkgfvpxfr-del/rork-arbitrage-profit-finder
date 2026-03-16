import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const AUTH_STORAGE_KEY = 'auth_user';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithApple: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
          console.log('Auth loaded from storage:', parsedUser.email);
        }
      } catch (error) {
        console.error('Failed to load auth:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      if (email.length > 0 && password.length >= 4) {
        const newUser: User = {
          id: '1',
          name: 'Alex Johnson',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        console.log('Login successful');
        return true;
      }
      
      console.log('Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const loginWithApple = useCallback(async (name: string, email: string): Promise<boolean> => {
    try {
      console.log('Attempting Apple login for:', email || 'hidden email');
      const newUser: User = {
        id: 'apple_' + Date.now(),
        name: name || 'Apple User',
        email: email || 'apple@privaterelay.appleid.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      console.log('Apple login successful');
      return true;
    } catch (error) {
      console.error('Apple login error:', error);
      return false;
    }
  }, []);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithApple,
    logout,
  }), [user, isLoading, login, loginWithApple, logout]);
});
