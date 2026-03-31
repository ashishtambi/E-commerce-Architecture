import { LayoutDashboard, LogOut, Package, ShoppingCart, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const menu = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-admin-bg text-slate-800">
      <div className="mx-auto grid min-h-screen max-w-[1400px] md:grid-cols-[250px,1fr]">
        <aside className="border-r border-amber-200 bg-white px-4 py-6">
          <h1 className="font-display text-3xl text-admin-accent">VastraLuxe</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Admin Studio</p>

          <nav className="mt-8 flex flex-col gap-2 text-sm">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                      isActive ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-50'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-300 px-3 py-2 text-sm text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </aside>

        <div>
          <header className="flex items-center justify-between border-b border-amber-200 bg-white px-5 py-4">
            <div>
              <h2 className="font-display text-2xl">Welcome, {admin?.name}</h2>
              <p className="text-xs text-slate-500">Manage products, orders, and customers.</p>
            </div>
          </header>

          <main className="p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
