import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-brand-dark/80 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            NotesOrganizer
          </Link>
          {/* Future nav links can go here */}
          <div>
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