'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Network, Menu, X } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);


  const navLinks = [
    { href: '/knowledge-hub', label: 'Knowledge Hub' },
    { href: '/tools', label: 'AI Tools' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm z-50 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Network className="text-blue-500" />
            <span>NotesOrganizer</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link 
              href="/#waitlist" 
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              Join Waitlist
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-900 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex flex-col text-lg mt-8">
          {navLinks.map((link) => {
             const isActive = pathname.startsWith(link.href);
             return (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                onClick={handleLinkClick}
                className={`block w-full text-left p-4 border-b border-white/10 transition-colors ${
                  isActive
                    ? 'text-white font-semibold bg-blue-500/10'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#waitlist"
            className="block w-full text-left p-4 border-b border-white/10 text-gray-300 hover:bg-white/5"
            onClick={handleLinkClick}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;