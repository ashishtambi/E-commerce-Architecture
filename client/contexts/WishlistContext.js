'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const GUEST_WISHLIST_KEY = 'vastraluxe_guest_wishlist';
const WishlistContext = createContext(null);

const readGuestWishlist = () => {
  const raw = window.localStorage.getItem(GUEST_WISHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
};

const writeGuestWishlist = (wishlist) => {
  window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
};

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncWishlist = async () => {
      setLoading(true);

      if (!token) {
        setWishlist(readGuestWishlist());
        setLoading(false);
        return;
      }

      try {
        const data = await api.getWishlist(token);
        setWishlist(data.wishlist || []);
      } catch (error) {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    syncWishlist();
  }, [token]);

  const toggle = async (product) => {
    if (token) {
      const data = await api.toggleWishlist(token, product._id);
      setWishlist(data.wishlist || []);
      return;
    }

    const guestWishlist = readGuestWishlist();
    const exists = guestWishlist.some((item) => item._id === product._id);

    const nextWishlist = exists
      ? guestWishlist.filter((item) => item._id !== product._id)
      : [...guestWishlist, product];

    writeGuestWishlist(nextWishlist);
    setWishlist(nextWishlist);
  };

  const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      toggle,
      isWishlisted,
    }),
    [wishlist, loading]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }

  return context;
};
