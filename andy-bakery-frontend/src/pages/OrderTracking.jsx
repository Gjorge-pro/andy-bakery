import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import socket, { EVENTS } from '../socket';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderTracking() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on(EVENTS.ORDER_UPDATED, (updatedOrder) => {
      setOrders((prev) => {
        const orderExists = prev.some((order) => order.id === updatedOrder.id);
        if (orderExists) {
          toast.success('Your order status has been updated!');
          return prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
        }
        return prev;
      });
    });

    return () => {
      socket.off(EVENTS.ORDER_UPDATED);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter the email used when ordering');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/orders/track', {
        params: { email: email.trim() },
      });

      setOrders(response.data);
      setHasSearched(true);
    } catch (err) {
      console.error('Error tracking orders:', err);
      setError(err.response?.data?.message || 'Failed to track orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-grow py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1
              style={{ color: '#7B4F2E' }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Track Your Order
            </h1>
            <p className="text-gray-600 text-lg">
              Enter the email used when ordering to view your Andy Bakery orders.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Update Email
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email used when ordering"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#7B4F2E' }}
                className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading && <Spinner label="Tracking orders..." />}

          {!loading && hasSearched && !error && orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600 flex flex-col items-center">
              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-12px); }
                }
                .tracking-empty-icon {
                  animation: bounce 1.5s ease-in-out infinite;
                }
              `}</style>
              <div className="tracking-empty-icon text-8xl mb-4">📦</div>
              <p className="text-lg font-semibold mb-2">No orders found</p>
              <p>Please check the email used when ordering, or DM @andy_bakery_tz for help.</p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-b py-4 mb-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Items Ordered</h2>
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.product?.name || 'Bakery item'}
                            </p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p
                              className="font-semibold"
                              style={{ color: '#7B4F2E' }}
                            >
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-gray-600">
                              ${item.unitPrice.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total Price</span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: '#7B4F2E' }}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
