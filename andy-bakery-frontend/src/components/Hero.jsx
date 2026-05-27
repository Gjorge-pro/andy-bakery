import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../config/images';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-center overflow-hidden">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .slide-image {
            transition: opacity 1s ease;
          }
        `}
      </style>

      {/* Slideshow Background */}
      <div className="absolute inset-0 w-full h-full bg-[#8B5A2B]">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={index}
            src={slide.url}
            alt={slide.alt}
            className="absolute inset-0 w-full h-full object-cover slide-image"
            style={{ opacity: currentSlide === index && !imageErrors[index] ? 1 : 0 }}
            onError={() => handleImageError(index)}
          />
        ))}

        {/* Dark Overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        ></div>
      </div>

      {/* Previous Button (Hidden on Mobile) */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all items-center justify-center text-white"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Button (Hidden on Mobile) */}
      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all items-center justify-center text-white"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-32 sm:pb-40 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight font-extrabold text-white tracking-tight mb-4 sm:mb-6">
            Fresh Baked With Love
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 sm:mb-10 leading-relaxed font-light">
            Serving Arusha, Tanzania with the finest Custom Cakes, Artisan Bread, Handcrafted Pizza, and Exquisite Desserts.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/order"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#8B5A2B] text-white text-sm sm:text-base font-semibold rounded-full hover:bg-[#6B4423] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Order Now
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white hover:text-[#8B5A2B] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-24 sm:bottom-48 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              currentSlide === index
                ? 'bg-[#8B5A2B] w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Feature Cards - Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center text-center animate-fade-in-up delay-100 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] text-[#8B5A2B] rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <Star size={20} />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#8B5A2B] mb-1 sm:mb-2">Premium Quality</h3>
              <p className="text-xs sm:text-sm text-gray-600">Finest ingredients for the best taste</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center text-center animate-fade-in-up delay-200 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] text-[#8B5A2B] rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <Truck size={20} />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#8B5A2B] mb-1 sm:mb-2">Fast Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-600">Delivered fresh to your doorstep</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center text-center animate-fade-in-up delay-300 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] text-[#8B5A2B] rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <Heart size={20} />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#8B5A2B] mb-1 sm:mb-2">Made with Love</h3>
              <p className="text-xs sm:text-sm text-gray-600">Handcrafted with passion daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
