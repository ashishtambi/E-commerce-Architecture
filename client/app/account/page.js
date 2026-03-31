'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { formatINR } from '../../lib/format';

export default function AccountPage() {
  const { token, user, logout, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoadingOrders(false);
        return;
      }

      try {
        const data = await api.myOrders(token);
        setOrders(data.orders || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user, refreshUser]);

  if (!token) {
    return (
      <div className="luxe-container py-16">
        <div className="luxe-panel p-10 text-center">
          <h1 className="font-serifDisplay text-3xl">Please login to view your account</h1>
          <Link href="/login" className="mt-6 inline-block rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luxe-container py-10">
      <div className="grid gap-8 lg:grid-cols-[340px,1fr]">
        <aside className="luxe-panel h-fit p-5">
          <h1 className="font-serifDisplay text-3xl">My Account</h1>
          <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || 'Not added'}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-5 rounded-full border border-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600"
          >
            Logout
          </button>
        </aside>

        <section className="space-y-4">
          <h2 className="font-serifDisplay text-3xl">My Orders</h2>

          {loadingOrders ? (
            <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800" />
          ) : orders.length === 0 ? (
            <div className="luxe-panel p-8 text-center">
              <p className="text-sm">No orders yet.</p>
              <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-accent-600 dark:text-accent-200">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article key={order._id} className="luxe-panel p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700 dark:bg-slate-800 dark:text-accent-200">
                    {order.status}
                  </p>
                </div>

                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {order.items.map((item) => (
                    <p key={`${order._id}-${item.product}`}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>

                <p className="mt-3 font-semibold text-accent-600 dark:text-accent-200">Total: {formatINR(order.totalAmount)}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
