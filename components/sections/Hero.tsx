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
        <Link 
          href="/knowledge-hub/pkm-ultimate-guide" 
          className="mt-10 inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-md hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          Start with the Ultimate PKM Guide →
        </Link>
      </div>
    </section>
  );
};

export default HeroSection; 