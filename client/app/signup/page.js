'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      await register(form);
      router.push('/account');
    } catch (submitError) {
      setError(submitError.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxe-container py-16">
      <div className="mx-auto max-w-md luxe-panel p-6 sm:p-8">
        <h1 className="font-serifDisplay text-3xl">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join VastraLuxe and save your curated wardrobe.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="text-sm">
            Full Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            />
          </label>

          <label className="text-sm">
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-accent-300/50 bg-transparent px-3 py-2"
            />
          </label>

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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent-600 dark:text-accent-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
