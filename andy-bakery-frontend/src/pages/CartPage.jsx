import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Cake } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 1;
    updateQuantity(productId, quantity);
  };

  if (cartCount === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
          .cart-empty-icon {
            animation: pulse 2s ease-in-out infinite;
          }
        `}</style>
        <Navbar />
        <section className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm p-12 text-center border border-gray-100">
            <div className="cart-empty-icon text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-[#7B4F2E] mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added any of our delicious treats yet. Let's fix that!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-[#7B4F2E] text-white font-bold rounded-full hover:bg-[#5C3317] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex-grow py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#7B4F2E] mb-3">
              Your Cart
            </h1>
            <p className="text-gray-500 text-lg">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.product.id}
                  className="bg-white rounded-3xl shadow-sm p-5 flex flex-col sm:flex-row gap-6 border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-[#FFF8F0] rounded-2xl overflow-hidden relative">
                    {cartItem.product.imageUrl ? (
                      <img
                        src={cartItem.product.imageUrl}
                        alt={cartItem.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#7B4F2E] opacity-40">
                        <Cake size={40} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#7B4F2E] transition-colors">
                          {cartItem.product.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                          {cartItem.product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#7B4F2E]">
                          ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          ${cartItem.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-100">
                        <button
                          onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#7B4F2E] transition-colors disabled:opacity-50"
                          disabled={cartItem.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-800">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#7B4F2E] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(cartItem.product.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition-colors text-sm font-bold"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-[32px] shadow-sm p-8 sticky top-24 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 pb-8 border-b border-gray-100 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="text-sm italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-medium text-gray-500">Total</span>
                  <span className="text-4xl font-extrabold text-[#7B4F2E]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/order')}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#7B4F2E] text-white font-bold rounded-full mb-4 hover:bg-[#5C3317] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link
                  to="/products"
                  className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:border-[#7B4F2E] hover:text-[#7B4F2E] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
