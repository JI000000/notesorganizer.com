import { Zap, Bot, FileText } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    icon: <FileText size={32} />,
    title: "AI Note Summarizer",
    description: "Paste any note or article. Get a perfect, one-paragraph summary in seconds.",
    link: "/tools/summarizer",
    status: "Available"
  },
  {
    icon: <Bot size={32} />,
    title: "AI Tag Suggester",
    description: "Input your text, get 5-10 relevant tags to categorize your knowledge.",
    link: "#",
    status: "Coming Soon"
  },
  {
    icon: <Zap size={32} />,
    title: "AI Action-Item Extractor",
    description: "Find all the to-dos and action items from your meeting notes automatically.",
    link: "#",
    status: "Coming Soon"
  }
];

export default function ToolsIndex() {
  return (
    <div className="container mx-auto px-6 py-24 pt-48">
      <h1 className="text-5xl font-bold text-white mb-4">AI Micro-Tools</h1>
      <p className="text-lg text-gray-400 mb-12">Automate the tedious parts of Personal Knowledge Management.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.link} className={`block bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-brand-blue hover:scale-105 transition-all ${tool.status === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex text-brand-blue mb-4">
              {tool.icon}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{tool.title}</h3>
              {tool.status === 'Coming Soon' && (
                <span className="bg-gray-700 text-xs font-semibold text-gray-300 px-2 py-1 rounded-full">{tool.status}</span>
              )}
            </div>
            <p className="mt-4 text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 