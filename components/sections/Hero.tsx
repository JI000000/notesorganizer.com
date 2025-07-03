import Link from "next/link";

const HeroSection = () => {
  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="container mx-auto px-6 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
          Beyond Note-Taking:
          <br />
          <span className="text-blue-500">Master Your Personal Knowledge.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          A definitive resource hub with systems, guides, and AI-powered tools to transform your scattered notes into a structured, interconnected knowledge base.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/workbench"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center"
          >
            Try AI Workbench Free
          </a>
          <a
            href="/knowledge-hub/pkm-ultimate-guide"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500 text-center"
          >
            Read the Guide
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 