'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { api } from '../../lib/api';
import { formatINR } from '../../lib/format';

const initialForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

export default function CheckoutPage() {
  const { token } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState('dummy_gateway');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      setStatus('Please login before checkout.');
      return;
    }

    if (!cart.length) {
      setStatus('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const data = await api.createOrder(token, {
        shippingAddress: form,
        paymentMethod,
      });

      await clearCart();
      setStatus(`Order placed successfully. Order ID: ${data.order._id}`);
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxe-container py-10">
      <h1 className="section-title mb-6">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        <form onSubmit={placeOrder} className="luxe-panel space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Full Name
              <input
                required
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Phone
              <input
                required
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              />
            </label>
          </div>

          <label className="text-sm">
            Address
            <input
              required
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm">
              City
              <input
                required
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              />
            </label>

            <label className="text-sm">
              State
              <input
                required
                value={form.state}
                onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Pincode
              <input
                required
                value={form.pincode}
                onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold">Payment Method (Dummy Integration)</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <button
                type="button"
                onClick={() => setPaymentMethod('dummy_gateway')}
                className={`rounded-full border px-4 py-1.5 ${
                  paymentMethod === 'dummy_gateway'
                    ? 'border-accent-600 bg-accent-600 text-white'
                    : 'border-accent-300/50 dark:border-slate-600'
                }`}
              >
                Demo Card Gateway
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`rounded-full border px-4 py-1.5 ${
                  paymentMethod === 'cod'
                    ? 'border-accent-600 bg-accent-600 text-white'
                    : 'border-accent-300/50 dark:border-slate-600'
                }`}
              >
                Cash on Delivery
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
              This is a simulated payment flow for demo and testing.
            </p>
          </div>

          {status && <p className="rounded-xl bg-accent-100/80 px-3 py-2 text-sm dark:bg-slate-800">{status}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>

          {!token && (
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Need an account? <Link href="/login" className="text-accent-600 dark:text-accent-200">Login here</Link>
            </p>
          )}
        </form>

        <aside className="luxe-panel h-fit p-5">
          <h2 className="font-serifDisplay text-2xl">Order Total</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
