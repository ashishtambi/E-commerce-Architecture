'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(form);
      router.push('/account');
    } catch (submitError) {
      setError(submitError.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxe-container py-16">
      <div className="mx-auto max-w-md luxe-panel p-6 sm:p-8">
        <h1 className="font-serifDisplay text-3xl">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Login to access cart sync, orders and wishlist.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="text-sm">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            />
          </label>

          <label className="text-sm">
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            />
          </label>

          {error && <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-accent-600 dark:text-accent-200">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
