const HeroSection = () => {
  return (
    <section id="hero" className="w-full h-screen flex items-center justify-center text-center">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Beyond Note-Taking.
          <br />
          <span className="text-brand-blue">Master Your Knowledge.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          The definitive hub for frameworks, guides, and AI-powered tools to transform your scattered notes into a structured, interconnected knowledge base.
        </p>
        <a 
          href="#toolkit" 
          className="mt-8 inline-block bg-brand-blue text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Explore Tools & Guides
        </a>
      </div>
    </section>
  );
};

export default HeroSection; 