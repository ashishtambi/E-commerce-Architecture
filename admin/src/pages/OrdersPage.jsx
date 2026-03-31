import { useEffect, useState } from 'react';
import { adminApi } from '../api';

const statuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.orders();
      setOrders(response.data.orders || []);
    } catch (error) {
      setOrders([]);
      setStatusMessage('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status } : order)));
      setStatusMessage('Order status updated.');
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Unable to update order status.');
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5">
      <h2 className="mb-4 font-display text-3xl">Manage Orders</h2>

      {statusMessage && <p className="mb-4 rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-800">{statusMessage}</p>}

      {loading ? (
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Items</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-amber-100 align-top">
                  <td className="px-2 py-2">
                    <p className="font-medium">{order._id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-2 py-2">
                    <p>{order.user?.name}</p>
                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                  </td>
                  <td className="px-2 py-2">
                    {order.items.map((item) => (
                      <p key={`${order._id}-${item.product}`} className="text-xs">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-2 py-2 font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2">
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order._id, event.target.value)}
                      className="rounded-lg border border-amber-300 px-2 py-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
