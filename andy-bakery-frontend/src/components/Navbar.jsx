import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Menu, X } from 'lucide-react';
import CartIcon from './CartIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Order', path: '/order' },
    { name: 'Track Order', path: '/track' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-[70px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-[#8B5A2B] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <ChefHat size={24} />
            </div>
            <span className="text-xl font-bold text-[#8B5A2B] tracking-tight">
              Andy Bakery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center h-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-[#8B5A2B] ${
                  isActive(link.path) ? 'text-[#8B5A2B]' : 'text-gray-600'
                }`}
              >
                {link.name}
                <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#8B5A2B] transform origin-left transition-transform duration-300 ease-out ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
            <div className="pl-6 border-l border-gray-200 flex items-center">
              <CartIcon />
            </div>
          </div>

          {/* Mobile menu button and cart icon */}
          <div className="md:hidden flex items-center gap-4">
            <CartIcon />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-[#8B5A2B] hover:bg-[#FFF8F0] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden absolute top-[70px] left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#8B5A2B] bg-[#FFF8F0]'
                    : 'text-gray-600 hover:text-[#8B5A2B] hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
