import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { createOrder } from '../api/orderApi';
import { Phone, MapPin, Check } from 'lucide-react';

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
  });

  useEffect(() => {
    if (cartCount === 0 && !success) {
      navigate('/cart');
    }
  }, [cartCount, navigate, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setFormData((prev) => ({
      ...prev,
      customerPhone: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || 
        !formData.customerEmail.trim() || !formData.deliveryAddress.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const phoneRegex = /^[0-9+]{9,}$/;
    if (!phoneRegex.test(formData.customerPhone)) {
      setError('Phone number must contain only digits and + and be at least 9 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        deliveryAddress: formData.deliveryAddress,
        orderItems: orderItems,
      };

      await createOrder(orderData);

      setSuccess(true);
      clearCart();
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error creating order:', err);
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map(e => e.msg).join(', ');
        setError(messages);
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to place order. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0 && !success) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Spinner label="Redirecting..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex-grow py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#7B4F2E] mb-4">
              Complete Your Order
            </h1>
            <p className="text-gray-500 text-lg">
              Review your selection and provide delivery details.
            </p>
          </div>

          {success && (
            <div className="mb-10 max-w-2xl mx-auto p-8 bg-white border-2 border-green-500 rounded-3xl text-center shadow-lg transform transition-all">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <Check size={40} strokeWidth={3} />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">Thank you for your order. Andy Bakery will contact you shortly to confirm delivery.</p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                <Spinner /> Redirecting to home...
              </div>
            </div>
          )}

          {error && !success && (
            <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
              <p className="font-bold text-lg mb-1">Could not place order</p>
              <p>{error}</p>
            </div>
          )}

          {!success && (
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Left Column: Order Summary */}
              <div className="lg:w-1/3 order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-gray-800 leading-tight">{item.product.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium text-sm">
                      <span>Delivery</span>
                      <span className="italic">Contact us for quote</span>
                    </div>
                    <div className="flex justify-between items-end pt-6 mt-4 border-t border-gray-100">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-3xl font-extrabold text-[#7B4F2E]">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link to="/cart" className="mt-8 block text-center font-semibold text-gray-500 hover:text-[#7B4F2E] transition-colors">
                    ← Edit Cart
                  </Link>
                </div>
              </div>

              {/* Right Column: Delivery Form */}
              <div className="lg:w-2/3 order-1 lg:order-2">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Delivery Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B4F2E]/20 focus:border-[#7B4F2E] transition-all"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          placeholder="For order updates"
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B4F2E]/20 focus:border-[#7B4F2E] transition-all"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Phone size={16} className="text-[#7B4F2E]" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handlePhoneChange}
                        placeholder="+255 781 694 772"
                        inputMode="tel"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B4F2E]/20 focus:border-[#7B4F2E] transition-all"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <MapPin size={16} className="text-[#7B4F2E]" /> Delivery Address *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Detailed delivery address in Arusha..."
                        rows="3"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B4F2E]/20 focus:border-[#7B4F2E] transition-all resize-none"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 mt-4 bg-[#7B4F2E] text-white font-bold text-lg rounded-xl hover:bg-[#5C3317] transition-colors disabled:opacity-70 shadow-md"
                    >
                      {loading ? 'Processing...' : 'Place Order Now'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
