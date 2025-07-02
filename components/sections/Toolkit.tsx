import { Book, Zap, BrainCircuit, PenTool, Combine, FileText, BotMessageSquare, Tags, ListTodo, CaseUpper, BookCopy, Pilcrow } from 'lucide-react';
import Link from 'next/link';

const guides = [
  {
    icon: BookCopy,
    title: 'The Ultimate Guide to PKM',
    description: 'Our flagship, in-depth guide covering frameworks, tools, and best practices for modern knowledge management.',
    link: '/knowledge-hub/pkm-ultimate-guide',
    status: 'live',
  },
  {
    icon: Combine,
    title: 'Zettelkasten vs. PARA vs. LYT',
    description: 'A deep dive into the most popular knowledge management frameworks. Find the right one for you.',
    link: '/knowledge-hub/pkm-foundations-zettelkasten-para-lyt',
    status: 'live',
  },
  {
    icon: BrainCircuit,
    title: 'How to Build Your Second Brain',
    description: 'A step-by-step tutorial for implementing your chosen framework using popular tools like Obsidian or Logseq.',
    link: '#',
    status: 'soon',
  }
];

const tools = [
  {
    icon: BotMessageSquare,
    name: "AI Note Summarizer",
    description: "Paste any note or article. Get a perfect, one-paragraph summary in seconds.",
    href: "/tools/summarizer",
    status: 'live',
  },
  {
    icon: CaseUpper,
    name: "AI Title Generator",
    description: "Struggling with a title? Get a list of compelling, creative titles for your content.",
    href: "/tools/title-generator",
    status: 'live',
  },
  {
    icon: Tags,
    name: "AI Tag Suggester",
    description: "Input your text, get 5-10 relevant tags to categorize your knowledge.",
    href: "#",
    status: 'soon',
  },
  {
    icon: ListTodo,
    name: "AI Action-Item Extractor",
    description: "Find all the to-dos and action items from your meeting notes automatically.",
    href: "#",
    status: 'soon',
  },
];

const ToolkitSection = () => {
  return (
    <section id="toolkit" className="w-full py-24 sm:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your Free PKM Toolkit
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-400">
          A curated collection of in-depth guides and AI-powered utilities to build your Second Brain.
        </p>
      </div>
      
      <div className="container mx-auto px-6 mt-16">
        <div className="text-left mb-8">
            <h3 className="text-2xl font-semibold text-white">In-Depth Guides</h3>
            <p className="text-gray-400 mt-1">Master the frameworks of modern knowledge management.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
             <Link key={guide.title} href={guide.link} className="block p-8 bg-slate-800/50 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full relative">
                {guide.status === 'soon' && (
                  <div className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-full">Coming Soon</div>
                )}
                <guide.icon className="h-10 w-10 text-blue-500" />
                <h4 className="mt-4 text-xl font-bold text-gray-100">{guide.title}</h4>
                <p className="mt-2 text-gray-400">{guide.description}</p>
             </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20">
        <div className="text-left mb-8">
            <h3 className="text-2xl font-semibold text-white">Free AI Micro-Tools</h3>
            <p className="text-gray-400 mt-1">Automate the tedious parts of structuring your knowledge.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
             <Link key={tool.name} href={tool.href} className="block p-8 bg-slate-800/50 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full relative">
                {tool.status === 'soon' && (
                  <div className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-full">Coming Soon</div>
                )}
                <tool.icon className="h-10 w-10 text-blue-500" />
                <h4 className="mt-4 text-xl font-bold text-gray-100">{tool.name}</h4>
                <p className="mt-2 text-gray-400">{tool.description}</p>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolkitSection; 