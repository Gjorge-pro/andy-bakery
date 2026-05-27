import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { getAllProducts } from '../api/productApi';
import { ChefHat, Cake } from 'lucide-react';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ),
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleOrderNow = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/order?productId=${product.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <ChefHat size={40} className="text-[#7B4F2E]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#7B4F2E]">
                Our Menu
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Fresh-baked items made daily with love and the finest ingredients.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20">
              <Spinner label="Loading our fresh baked goods..." />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
              <p className="mb-4 text-lg">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6 text-[#7B4F2E] opacity-50">
                <Cake size={80} strokeWidth={1} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No Products Yet</h2>
              <p className="text-gray-600 text-lg">
                We're currently preparing our menu. Check back soon!
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm shadow-sm ${
                      selectedCategory === category
                        ? 'bg-[#7B4F2E] text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-[#FFF8F0] hover:text-[#7B4F2E] border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Grid: 3 cols desktop, 2 tablet, 1 mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOrderNow={handleOrderNow}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
