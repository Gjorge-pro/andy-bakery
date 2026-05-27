import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminNavbar';
import Spinner from '../../components/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/currency';

const brown = '#8B5A2B';

const allowedTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout pageTitle="Manage Orders" pageSubtitle="View and update order statuses">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Spinner label="Loading orders..." />
      )}

      {/* Orders List */}
      {!loading && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-600">
              <p className="text-lg">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order.id ? null : order.id
                    )
                  }
                  className="p-6 cursor-pointer"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Customer Name */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">
                        Customer
                      </p>
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">
                        Email
                      </p>
                      <p className="text-gray-700 truncate">{order.customerEmail}</p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">
                        Total
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: brown }}
                      >
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          disabled={
                            allowedTransitions[order.status].length === 0
                          }
                          className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold border-0 ${
                            allowedTransitions[order.status].length === 0
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          } ${getStatusColor(order.status)}`}
                        >
                          <option value={order.status}>{order.status}</option>
                          {allowedTransitions[order.status].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {allowedTransitions[order.status].length === 0 && (
                          <span className="text-lg">🔒</span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">
                        Date
                      </p>
                      <p className="text-gray-700 text-sm">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <div className="border-t px-6 py-4 bg-gray-50">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Customer Information
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-semibold">Name:</span> {order.customerName}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{' '}
                            {order.customerEmail}
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{' '}
                            {order.customerPhone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Delivery Address
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="bg-white rounded border">
                          {order.orderItems.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 border-b last:border-b-0 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {item.product?.name || `Item ${index + 1}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className="font-semibold"
                                  style={{ color: brown }}
                                >
                                  {formatCurrency(item.unitPrice * item.quantity)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatCurrency(item.unitPrice)} each
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No items in this order</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}
