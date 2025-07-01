const ConversionSection = () => {
  return (
    <section id="waitlist" className="w-full py-20 bg-gray-900">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Stop Organizing. Start Knowing.
        </h2>
        <p className="mt-6 text-xl text-gray-300">
          Manual tools are a great start. But the future of personal knowledge is effortless and automatic. We are building{' '}
          <span className="text-white font-semibold">KortexAI</span>, the first platform that connects to your existing notes (local Markdown files, Obsidian) and uses AI to{' '}
          <span className="text-white font-semibold">automatically</span> structure, link, and surface insights you didn't even know you had.
        </p>
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-white">Be the First to Experience the Future.</h3>
          <form className="mt-6 flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
            <button 
              type="submit"
              className="bg-brand-blue text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Join the Private Waitlist
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500">Join 100+ PKM enthusiasts. No spam, ever.</p>
        </div>
      </div>
    </section>
  );
};

export default ConversionSection; 