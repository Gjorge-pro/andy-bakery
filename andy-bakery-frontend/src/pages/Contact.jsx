import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Camera, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  const contactItems = [
    {
      icon: <Phone size={32} strokeWidth={1.5} />,
      title: 'Call Us',
      value: '+255 781 694 772',
      href: 'tel:+255781694772',
      note: 'Available daily for direct orders and inquiries.',
    },
    {
      icon: <Camera size={32} strokeWidth={1.5} />,
      title: 'Instagram',
      value: '@andy_bakery_tz',
      href: 'https://instagram.com/andy_bakery_tz',
      note: 'DM us for custom cakes and view our latest bakes.',
    },
    {
      icon: <MapPin size={32} strokeWidth={1.5} />,
      title: 'Location',
      value: 'Arusha, Tanzania',
      note: 'Freshly baked locally for all your celebrations.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#7B4F2E] mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Order via Instagram DM, call us, or send a WhatsApp message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactItems.map((item) => (
              <div key={item.title} className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                <div className="w-20 h-20 rounded-full bg-[#FFF8F0] flex items-center justify-center mb-6 text-[#7B4F2E] group-hover:bg-[#7B4F2E] group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h2 className="font-bold text-xl text-gray-900 mb-3">
                  {item.title}
                </h2>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-[#7B4F2E] font-bold text-lg hover:underline mb-3"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[#7B4F2E] font-bold text-lg mb-3">{item.value}</p>
                )}
                <p className="text-sm text-gray-500 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#FFF8F0] rounded-[32px] shadow-sm p-12 text-center max-w-3xl mx-auto border border-[#7B4F2E]/10">
            <h2 className="text-3xl font-extrabold text-[#7B4F2E] mb-4">
              Order via WhatsApp
            </h2>
            <p className="text-gray-700 mb-10 text-lg">
              Quick and easy ordering. Tell us what you need—Custom Cakes, Bread, Pizza, or Desserts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/255781694772"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <MessageCircle size={24} />
                WhatsApp Us
              </a>
              <a
                href="https://instagram.com/andy_bakery_tz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#7B4F2E] font-bold rounded-full border-2 border-[#7B4F2E] hover:bg-[#7B4F2E] hover:text-white transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <Camera size={24} />
                DM on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
