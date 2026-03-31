import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(form);
      navigate('/');
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-amber-700">VastraLuxe</p>
        <h1 className="mt-2 font-display text-4xl text-slate-800">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use seeded admin credentials to access dashboard.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="text-sm text-slate-700">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-amber-200 px-3 py-2 outline-none focus:border-amber-500"
            />
          </label>

          <label className="text-sm text-slate-700">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-amber-200 px-3 py-2 outline-none focus:border-amber-500"
            />
          </label>

          {error && <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
