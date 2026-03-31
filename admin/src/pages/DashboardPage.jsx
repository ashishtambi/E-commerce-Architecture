import { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { IndianRupee, Package, ShoppingCart, Users } from 'lucide-react';
import { adminApi } from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const monthLabel = (entry) => `${entry._id.month}/${entry._id.year}`;

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then((response) => setStats(response.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const revenueData = useMemo(() => {
    if (!stats?.monthlyRevenue?.length) return null;

    return {
      labels: stats.monthlyRevenue.map(monthLabel),
      datasets: [
        {
          label: 'Revenue',
          data: stats.monthlyRevenue.map((entry) => entry.revenue),
          backgroundColor: '#b7791f',
          borderRadius: 8,
        },
      ],
    };
  }, [stats]);

  const statusData = useMemo(() => {
    if (!stats?.ordersByStatus) return null;

    const labels = Object.keys(stats.ordersByStatus);

    return {
      labels,
      datasets: [
        {
          data: Object.values(stats.ordersByStatus),
          backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#16a34a', '#ef4444'],
        },
      ],
    };
  }, [stats]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white" />;
  }

  if (!stats) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Unable to load stats.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingCart} title="Orders" value={stats.totalOrders} />
        <StatCard icon={Users} title="Customers" value={stats.totalUsers} />
        <StatCard icon={Package} title="Products" value={stats.totalProducts} />
        <StatCard icon={IndianRupee} title="Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <h3 className="mb-3 font-display text-2xl">Revenue Trend</h3>
          {revenueData ? <Bar data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} height={260} /> : <p className="text-sm text-slate-500">No revenue data yet.</p>}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <h3 className="mb-3 font-display text-2xl">Order Status</h3>
          {statusData ? <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false }} height={260} /> : <p className="text-sm text-slate-500">No order data yet.</p>}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4">
      <div className="mb-3 inline-flex rounded-full bg-amber-100 p-2 text-amber-700">
        <Icon size={16} />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}
