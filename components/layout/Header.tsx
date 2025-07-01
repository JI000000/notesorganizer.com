import Link from 'next/link';
import { Network } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-brand-dark/80 backdrop-blur-sm z-50 border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Network className="text-brand-blue" />
            <span>NotesOrganizer</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/knowledge-hub" className="text-gray-300 hover:text-white transition-colors">
              Knowledge Hub
            </Link>
            <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
              AI Tools
            </Link>
            <Link href="#waitlist" className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Join Waitlist
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 