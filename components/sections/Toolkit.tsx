import { Book, Zap, BrainCircuit } from 'lucide-react';

const toolkitItems = [
  {
    icon: <Book size={32} />,
    title: "In-Depth Guides",
    description: "From Zettelkasten to PARA, master the frameworks that turn information into knowledge.",
    link: "/knowledge-hub"
  },
  {
    icon: <Zap size={32} />,
    title: "Free AI Micro-Tools",
    description: "Automate the tedious parts of PKM with tools for summarizing, tagging, and cleaning your notes.",
    link: "/tools"
  },
  {
    icon: <BrainCircuit size={32} />,
    title: "Actionable Systems",
    description: "Learn step-by-step processes to build and maintain your 'Second Brain' in Obsidian, Logseq, or Notion.",
    link: "/knowledge-hub"
  }
];

const ToolkitSection = () => {
  return (
    <section id="toolkit" className="w-full py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white">Your Free PKM Toolkit</h2>
        <p className="mt-4 text-lg text-gray-400">Everything you need to get started, all in one place.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {toolkitItems.map((item, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-brand-blue hover:scale-105 transition-all">
              <div className="flex justify-center text-brand-blue mb-4">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 text-gray-400">{item.description}</p>
              <a href={item.link} className="mt-6 inline-block text-brand-blue font-semibold hover:underline">
                Learn More &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolkitSection; 