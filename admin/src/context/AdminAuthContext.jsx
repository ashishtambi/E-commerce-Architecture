import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminApi, setAuthToken } from '../api';

const STORAGE_KEY = 'vastraluxe_admin_token';
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = window.localStorage.getItem(STORAGE_KEY);

    if (!existingToken) {
      setLoading(false);
      return;
    }

    setToken(existingToken);
    setAuthToken(existingToken);

    adminApi
      .me()
      .then((response) => {
        if (response.data.user?.role === 'admin') {
          setAdmin(response.data.user);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
          setAuthToken(null);
        }
      })
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await adminApi.login(credentials);

    if (response.data.user?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const nextToken = response.data.token;

    window.localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setAdmin(response.data.user);
    setAuthToken(nextToken);
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAdmin(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token && admin),
    }),
    [token, admin, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }

  return context;
}
