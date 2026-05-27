import { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminLayout from '../../components/AdminNavbar';
import Spinner from '../../components/Spinner';
import axiosInstance from '../../api/axiosInstance';
import socket, { EVENTS } from '../../socket';
import { formatCurrency } from '../../utils/currency';

const brown = '#8B5A2B';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    mostPopularProduct: 'No orders yet',
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    socket.on(EVENTS.NEW_ORDER, (order) => {
      setStats((prev) => ({
        ...prev,
        orderCount: prev.orderCount + 1,
        pendingOrders: prev.pendingOrders + 1,
      }));
      setRecentOrders((prev) => {
        const updated = [order, ...prev];
        return updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      });
    });

    socket.on(EVENTS.ORDER_UPDATED, () => {
      fetchDashboardData();
    });

    return () => {
      socket.off(EVENTS.NEW_ORDER);
      socket.off(EVENTS.ORDER_UPDATED);
    };
  }, []);

  const getLastSevenDays = () => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);

      return {
        key: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: 0,
      };
    });
  };

  const getMostPopularProduct = (orders) => {
    const productCounts = new Map();

    orders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const name = item.product?.name || 'Bakery item';
        productCounts.set(name, (productCounts.get(name) || 0) + item.quantity);
      });
    });

    if (productCounts.size === 0) return 'No orders yet';

    return Array.from(productCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/products'),
        axiosInstance.get('/orders'),
      ]);

      const orders = ordersRes.data;
      const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED');
      const totalRevenue = deliveredOrders.reduce(
        (sum, order) => sum + Number(order.totalPrice || 0),
        0
      );
      const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;
      const days = getLastSevenDays();
      const ordersByDay = new Map(days.map((day) => [day.key, day]));

      orders.forEach((order) => {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        const day = ordersByDay.get(key);
        if (day) day.orders += 1;
      });

      setStats({
        productCount: productsRes.data.length,
        orderCount: orders.length,
        totalRevenue,
        pendingOrders,
        mostPopularProduct: getMostPopularProduct(orders),
      });
      setChartData(days);
      setRecentOrders(
        [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || `Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-900';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-900';
      case 'DELIVERED':
        return 'bg-green-100 text-green-900';
      case 'CANCELLED':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const statCards = [
    { label: 'Total Products', value: stats.productCount, color: '#8B5A2B' },
    { label: 'Total Orders', value: stats.orderCount, color: '#8B5A2B' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#8B5A2B' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: '#8B5A2B' },
  ];

  const contentComponent = (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Loading dashboard..." />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
              >
                <p className="text-gray-600 text-sm font-semibold">{card.label}</p>
                <p className="text-4xl font-bold mt-4" style={{ color: card.color, fontSize: '34px' }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Chart and Popular Product */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div
              className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Orders Per Day</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis allowDecimals={false} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="orders" fill={brown} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              className="bg-white rounded-3xl p-6 shadow-sm"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
            >
              <p className="text-gray-600 text-sm font-semibold">Most Popular Product</p>
              <p className="text-2xl font-bold mt-4" style={{ color: brown }}>
                {stats.mostPopularProduct}
              </p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div
            className="bg-white rounded-3xl p-6 shadow-sm"
            style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-base">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 font-semibold" style={{ color: brown }}>
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <AdminLayout
      pageTitle="Dashboard"
      pageSubtitle="Welcome to Andy Bakery admin panel"
    >
      {contentComponent}
    </AdminLayout>
  );
}
