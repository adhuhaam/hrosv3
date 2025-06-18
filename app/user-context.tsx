import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/api/api';

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUserState(JSON.parse(stored));
      } catch (err) {
        console.warn('Failed to load user', err);
      }
    };
    load();
  }, []);

  const setUser = async (u: User | null) => {
    try {
      if (u) {
        await AsyncStorage.setItem('user', JSON.stringify(u));
      } else {
        await AsyncStorage.removeItem('user');
      }
      setUserState(u);
    } catch (err) {
      console.warn('Failed to set user', err);
    }
  };

  const logout = async () => {
    await setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
