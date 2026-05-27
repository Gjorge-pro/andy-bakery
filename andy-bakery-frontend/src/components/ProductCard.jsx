import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Cake } from 'lucide-react';

export default function ProductCard({ product, onOrderNow }) {
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);

    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 group">
      {/* Product Image */}
      <div className="relative w-full h-[200px] bg-[#FFF8F0] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!product.isAvailable ? 'grayscale opacity-70' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7B4F2E] opacity-30">
            <Cake size={64} strokeWidth={1} />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#7B4F2E] text-xs font-bold rounded-full shadow-sm uppercase tracking-wider">
          {product.category}
        </div>

        {/* Out of Stock Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#7B4F2E] transition-colors">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-2xl font-bold text-[#7B4F2E]">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || isAdding}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              product.isAvailable 
                ? 'bg-[#7B4F2E] text-white hover:bg-[#5C3317] hover:shadow-md transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} className={isAdding || showAdded ? 'opacity-0 absolute' : 'opacity-100'} />
            <span>{showAdded ? 'Added!' : isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
