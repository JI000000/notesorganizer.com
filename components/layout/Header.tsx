'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Network, Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

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
    { 
      href: '/tools', 
      label: 'Tools', 
      dropdown: [
        { href: '/tools/summarizer', label: 'AI Note Summarizer' },
        { href: '/tools/title-generator', label: 'AI Title Generator' },
        { href: '/tools/tag-suggester', label: 'AI Tag Suggester' },
        { href: '/tools/action-extractor', label: 'Action-Item Extractor' },
        { href: '/workbench', label: 'AI Workbench' },
        { href: '/collaboration-hub', label: 'Collaboration Hub' },
        { href: '/research-notes', label: 'Research Notes' },
      ]
    },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsToolsDropdownOpen(false);
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
              
              if (link.dropdown) {
                return (
                  <div key={link.href} className="relative">
                    <button
                      onMouseEnter={() => setIsToolsDropdownOpen(true)}
                      onMouseLeave={() => setIsToolsDropdownOpen(false)}
                      className={`flex items-center gap-1 transition-colors ${
                        isActive || pathname.startsWith('/workbench') || pathname.startsWith('/collaboration-hub') || pathname.startsWith('/research-notes') || pathname.startsWith('/tools/')
                          ? 'text-white font-semibold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 transition-all duration-200 ${
                        isToolsDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      onMouseEnter={() => setIsToolsDropdownOpen(true)}
                      onMouseLeave={() => setIsToolsDropdownOpen(false)}
                    >
                      {link.dropdown.map((dropdownItem) => {
                        const isDropdownActive = pathname === dropdownItem.href;
                        return (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className={`block px-4 py-3 text-sm transition-colors border-b border-slate-700/50 last:border-b-0 ${
                              isDropdownActive
                                ? 'text-white font-semibold bg-blue-500/10'
                                : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                          >
                            {dropdownItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
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
            if (link.dropdown) {
              return (
                <div key={`mobile-${link.href}`}>
                  <div className="block w-full text-left p-4 border-b border-white/10 text-gray-300 font-semibold">
                    {link.label}
                  </div>
                  {link.dropdown.map((dropdownItem) => {
                    const isDropdownActive = pathname === dropdownItem.href;
                    return (
                      <Link
                        key={`mobile-${dropdownItem.href}`}
                        href={dropdownItem.href}
                        onClick={handleLinkClick}
                        className={`block w-full text-left pl-8 pr-4 py-3 border-b border-white/10 transition-colors ${
                          isDropdownActive
                            ? 'text-white font-semibold bg-blue-500/10'
                            : 'text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        {dropdownItem.label}
                      </Link>
                    );
                  })}
                </div>
              );
            }
            
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