import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../config/images';

const FEATURE_CARDS = [
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Finest ingredients for the best taste',
    delay: 'delay-100',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Delivered fresh to your doorstep',
    delay: 'delay-200',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Handcrafted with passion daily',
    delay: 'delay-300',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

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
    <>
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

      {/* Hero: slideshow, overlay, headline, CTAs, slide dots */}
      <section
        className="relative w-full min-h-[min(100dvh,56rem)] sm:min-h-[calc(100vh-70px)] flex flex-col overflow-hidden"
        aria-label="Hero"
      >
        {/* Slideshow background */}
        <div className="absolute inset-0 w-full h-full bg-[#8B5A2B]" aria-hidden>
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
          <div className="absolute inset-0 w-full h-full bg-black/50" />
        </div>

        {/* Slide controls */}
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors items-center justify-center text-white"
          style={{ transform: 'translateY(-50%)' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors items-center justify-center text-white"
          style={{ transform: 'translateY(-50%)' }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Hero copy + CTAs (vertically centered) */}
        <div className="relative z-10 flex flex-1 flex-col justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight font-extrabold text-white tracking-tight mb-4 sm:mb-6 drop-shadow-sm">
              Fresh Baked With Love
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 sm:mb-10 leading-relaxed font-light max-w-2xl mx-auto">
              Serving Arusha, Tanzania with the finest Custom Cakes, Artisan Bread, Handcrafted Pizza, and Exquisite Desserts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <Link
                to="/order"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#8B5A2B] text-white text-sm sm:text-base font-semibold rounded-full hover:bg-[#6B4423] transition-colors shadow-lg text-center"
              >
                Order Now
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white hover:text-[#8B5A2B] transition-colors shadow-sm text-center"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dot indicators (in hero flow, not overlapping cards) */}
        <div className="relative z-20 flex justify-center gap-2 pb-6 sm:pb-8">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : undefined}
              className={`h-2 sm:h-3 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-[#8B5A2B] w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/70 w-2 sm:w-3'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Feature cards: always below hero, never overlapping */}
      <section
        className="w-full bg-white border-t border-gray-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8"
        aria-label="Why Andy Bakery"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {FEATURE_CARDS.map(({ icon: Icon, title, description, delay }) => (
              <div
                key={title}
                className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in-up ${delay} hover:shadow-md transition-shadow`}
              >
                <div className="w-12 h-12 bg-[#FFF8F0] text-[#8B5A2B] rounded-full flex items-center justify-center mb-4">
                  <Icon size={24} aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-[#8B5A2B] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
