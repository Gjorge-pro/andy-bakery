import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChefHat, Heart, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Baked with Love',
      description: 'Every recipe is crafted with passion and care to bring joy to your table.',
    },
    {
      icon: <Star size={32} />,
      title: 'Finest Ingredients',
      description: 'We source the best local ingredients to ensure premium quality in every bite.',
    },
    {
      icon: <Users size={32} />,
      title: 'Community First',
      description: 'Serving Arusha proudly, bringing people together through delicious food.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FFF8F0] to-[#f4eadf] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] text-[#7B4F2E] opacity-5 transform rotate-12 pointer-events-none">
          <ChefHat size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-[#7B4F2E] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
            <ChefHat size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#7B4F2E] mb-6 tracking-tight">
            Our Story
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Andy Bakery is a proudly local bakery in Arusha, Tanzania, dedicated to creating memorable culinary experiences through our fresh baked goods, custom cakes, and desserts.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#7B4F2E] mb-6">
                Fresh From Our Oven
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  At Andy Bakery, we believe that good food is the foundation of great memories. Whether it's a quiet morning breakfast with our artisan bread or a grand wedding celebration with our custom cakes, we are honored to be part of your lives.
                </p>
                <p>
                  Every day, our ovens are fired up early to ensure that only the freshest, highest-quality products make it to our customers. 
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[#7B4F2E] rounded-3xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
              <div className="aspect-square bg-[#FFF8F0] rounded-3xl relative z-10 border-2 border-white shadow-xl flex items-center justify-center p-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#7B4F2E] mb-2">Since Day One</h3>
                  <p className="text-gray-600">Uncompromising on quality and taste.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#7B4F2E] mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-[#7B4F2E] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-10 rounded-[32px] text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-[#FFF8F0] text-[#7B4F2E] rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#7B4F2E] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Experience Andy Bakery</h2>
          <p className="text-lg text-[#FFF8F0] mb-10 opacity-90">
            Discover our full range of products and taste the difference that love and dedication makes.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7B4F2E] font-bold rounded-full hover:bg-[#FFF8F0] transition-colors shadow-lg group"
          >
            Explore Menu
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
