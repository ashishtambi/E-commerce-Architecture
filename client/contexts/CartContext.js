'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'vastraluxe_guest_cart';
const CartContext = createContext(null);

const readGuestCart = () => {
  const raw = window.localStorage.getItem(GUEST_CART_KEY);
  return raw ? JSON.parse(raw) : [];
};

const writeGuestCart = (cart) => {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);

      if (!token) {
        const guestCart = readGuestCart();
        setCart(guestCart);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getCart(token);
        setCart(data.cart || []);
      } catch (error) {
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [token]);

  const addItem = async (product, options = {}) => {
    const payload = {
      productId: product._id,
      quantity: options.quantity || 1,
      size: options.size || product.sizes?.[0] || 'M',
      color: options.color || product.colors?.[0]?.name || 'Default',
    };

    if (token) {
      const data = await api.addCart(token, payload);
      setCart(data.cart);
      return;
    }

    const guestCart = readGuestCart();
    const existing = guestCart.find(
      (item) =>
        item.product._id === payload.productId &&
        item.size === payload.size &&
        item.color.toLowerCase() === payload.color.toLowerCase()
    );

    if (existing) {
      existing.quantity += payload.quantity;
    } else {
      guestCart.push({
        product,
        quantity: payload.quantity,
        size: payload.size,
        color: payload.color,
      });
    }

    writeGuestCart(guestCart);
    setCart(guestCart);
  };

  const updateQuantity = async (productId, quantity) => {
    const safeQty = Math.max(1, Number(quantity));

    if (token) {
      const data = await api.updateCart(token, productId, { quantity: safeQty });
      setCart(data.cart);
      return;
    }

    const guestCart = readGuestCart().map((item) =>
      item.product._id === productId ? { ...item, quantity: safeQty } : item
    );

    writeGuestCart(guestCart);
    setCart(guestCart);
  };

  const removeItem = async (productId) => {
    if (token) {
      const data = await api.removeCart(token, productId);
      setCart(data.cart);
      return;
    }

    const guestCart = readGuestCart().filter((item) => item.product._id !== productId);
    writeGuestCart(guestCart);
    setCart(guestCart);
  };

  const clearCart = async () => {
    if (token) {
      await api.clearCart(token);
    }

    setCart([]);
    writeGuestCart([]);
  };

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const unitPrice = item.product.discountedPrice || item.product.price;
        return sum + unitPrice * item.quantity;
      }, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setCart,
    }),
    [cart, loading, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
