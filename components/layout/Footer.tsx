const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-gray-900 py-6">
      <div className="container mx-auto px-6 text-center text-gray-500">
        <p>&copy; {currentYear} NotesOrganizer.com. All Rights Reserved.</p>
        <p className="mt-2 text-sm">A KortexAI Labs Project.</p>
      </div>
    </footer>
  );
};

export default Footer; 