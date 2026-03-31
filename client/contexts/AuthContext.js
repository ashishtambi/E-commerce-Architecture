'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const STORAGE_KEY = 'vastraluxe_token';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(
    async (authToken) => {
      if (!authToken) {
        setUser(null);
        return;
      }

      try {
        const data = await api.me(authToken);
        setUser(data.user);
      } catch (error) {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
    []
  );

  useEffect(() => {
    const existingToken = window.localStorage.getItem(STORAGE_KEY);

    if (existingToken) {
      setToken(existingToken);
      syncUser(existingToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [syncUser]);

  const login = async (payload) => {
    const data = await api.login(payload);
    setToken(data.token);
    setUser(data.user);
    window.localStorage.setItem(STORAGE_KEY, data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    setToken(data.token);
    setUser(data.user);
    window.localStorage.setItem(STORAGE_KEY, data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const refreshUser = async () => {
    await syncUser(token);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
