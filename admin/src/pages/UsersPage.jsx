import { useEffect, useState } from 'react';
import { adminApi } from '../api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .users()
      .then((response) => setUsers(response.data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5">
      <h2 className="mb-4 font-display text-3xl">Manage Users</h2>

      {loading ? (
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-amber-100">
                  <td className="px-2 py-2">{user.name}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  <td className="px-2 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-2 py-2">{user.phone || '-'}</td>
                  <td className="px-2 py-2 text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
