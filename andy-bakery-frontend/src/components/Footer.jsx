import { Phone, MapPin, Camera, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#5A3215]/95 backdrop-blur-sm text-white py-16 mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 tracking-tight text-[#FFF8F0]">Andy Bakery</h3>
            <p className="text-white/80 leading-relaxed text-sm max-w-sm">
              Custom Cakes, Cupcakes, Bread, Pizza, and Desserts made with love in Arusha, Tanzania. Freshly baked every day for every occasion.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#FFF8F0]">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Products
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#FFF8F0]">Contact & Social</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <a href="tel:+255781694772" className="flex items-start gap-3 hover:text-white transition-colors">
                  <Phone size={18} className="mt-0.5 opacity-80" />
                  <span>+255 781 694 772</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 opacity-80" />
                <span>Arusha, Tanzania</span>
              </li>
              <li>
                <a href="https://instagram.com/andy_bakery_tz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Camera size={18} className="opacity-80" />
                  <span>@andy_bakery_tz</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/255781694772" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors">
                  <MessageCircle size={18} className="opacity-80" />
                  <span>Order via WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
          <p>&copy; {currentYear} Andy Bakery. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with care in Arusha, Tanzania.</p>
        </div>
      </div>
    </footer>
  );
}
