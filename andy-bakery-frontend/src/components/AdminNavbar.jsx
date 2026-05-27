import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const brown = '#8B5A2B';

export default function AdminLayout({ children, pageTitle, pageSubtitle }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, adminName, adminPhoto } = useAuth();
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Manage Products', path: '/admin/products', icon: '🎂' },
    { name: 'Manage Orders', path: '/admin/orders', icon: '📦' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'A';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Fixed Sidebar */}
      <aside
        style={{ backgroundColor: brown, width: '260px' }}
        className="fixed top-0 left-0 h-screen shadow-lg text-white flex flex-col overflow-y-auto"
      >
        {/* Logo Section */}
        <div
          className="p-6 border-b"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🍰</span>
            <div>
              <h1 className="text-lg font-bold">Andy Bakery</h1>
              <p className="text-xs opacity-75">Admin</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow py-6 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl mb-2 transition-all duration-300 ${
                isActive(link.path)
                  ? 'bg-white text-gray-900 font-semibold shadow-md'
                  : 'text-white hover:bg-opacity-20 hover:translate-x-1'
              }`}
              style={
                !isActive(link.path)
                  ? { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                  : {}
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div
        className="flex-grow flex flex-col"
        style={{ marginLeft: '260px' }}
      >
        {/* Top Header - Sticky */}
        <div 
          className="sticky top-0 z-40 p-7 backdrop-blur-sm"
          style={{ 
            paddingLeft: '28px', 
            paddingRight: '28px', 
            paddingTop: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <div
            className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm"
            style={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Header Left */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Welcome back, {adminName || 'Admin'} 👋
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your bakery business efficiently
              </p>
            </div>

            {/* Header Right - Avatar with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative focus:outline-none"
              >
                {adminPhoto ? (
                  <img
                    src={adminPhoto}
                    alt="Admin"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: brown }}
                  >
                    {getInitials(adminName)}
                  </div>
                )}
                {/* Online Indicator */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg p-4 z-50"
                  style={{
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    top: '60px',
                  }}
                >
                  {/* Profile Header */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900 text-sm">
                      {adminName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Administrator</p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    Edit Profile
                  </Link>

                  <Link
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    Change Password
                  </Link>

                  <Link
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    Upload Photo
                  </Link>

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-200"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div
          className="flex-grow px-7 pb-8 overflow-y-auto pt-4"
          style={{ paddingLeft: '28px', paddingRight: '28px' }}
        >
          {pageTitle && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: '30px' }}>
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-gray-600 mt-2">{pageSubtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
