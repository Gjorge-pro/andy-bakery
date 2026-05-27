import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Cake, ChefHat, Star, Clock, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const specialties = [
    { title: 'Custom Cakes', icon: <Cake size={32} /> },
    { title: 'Cupcakes', icon: <Cake size={32} /> },
    { title: 'Artisan Bread', icon: <ChefHat size={32} /> },
    { title: 'Fresh Pizza', icon: <ChefHat size={32} /> },
    { title: 'Desserts', icon: <Cake size={32} /> },
  ];

  const whyChooseUs = [
    {
      icon: <Star size={40} strokeWidth={1.5} />,
      title: 'Premium Ingredients',
      description: 'We use only the finest, freshest ingredients to ensure every bite is a moment of pure joy.',
    },
    {
      icon: <Clock size={40} strokeWidth={1.5} />,
      title: 'Fresh Daily',
      description: 'Baked fresh every single morning. We believe in quality that you can taste in every crumb.',
    },
    {
      icon: <Truck size={40} strokeWidth={1.5} />,
      title: 'Reliable Delivery',
      description: 'Safe and timely delivery right to your door across Arusha and surrounding areas.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Our Specialties */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B5A2B] mb-4">Our Specialties</h2>
            <div className="w-24 h-1 bg-[#8B5A2B] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our range of handcrafted delights, made specifically to bring sweetness to your life.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {specialties.map((item) => (
              <div key={item.title} className="group bg-[#FFF8F0] rounded-2xl p-6 text-center hover:bg-[#8B5A2B] transition-colors duration-300 cursor-pointer shadow-sm">
                <div className="text-[#8B5A2B] group-hover:text-white flex justify-center mb-4 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-white transition-colors">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#8B5A2B] mb-4">Why Choose Andy Bakery</h2>
            <div className="w-24 h-1 bg-[#8B5A2B] mx-auto rounded-full mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="text-[#8B5A2B] mb-6 p-4 bg-[#FFF8F0] rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#8B5A2B] mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#8B5A2B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-[#FFF8F0] text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Browse our menu of Custom Cakes, Cupcakes, Bread, Pizza, and Desserts, and let us prepare something special for you.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7B4F2E] font-bold rounded-full hover:bg-[#FFF8F0] transition-colors shadow-lg group"
          >
            Start Your Order
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
