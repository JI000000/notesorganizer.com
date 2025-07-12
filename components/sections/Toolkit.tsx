import { Book, Zap, BrainCircuit, PenTool, Combine, FileText, BotMessageSquare, Tags, ListTodo, CaseUpper, BookCopy, Pilcrow } from 'lucide-react';
import Link from 'next/link';

const guides = [
  {
    icon: BookCopy,
    title: 'The Ultimate Guide to PKM',
    description: 'Our flagship, in-depth guide covering frameworks, tools, and best practices for modern knowledge management.',
    link: '/knowledge-hub/pkm-ultimate-guide',
    status: 'live',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
  },
  {
    icon: Combine,
    title: 'Zettelkasten vs. PARA vs. LYT',
    description: 'A deep dive into the most popular knowledge management frameworks. Find the right one for you.',
    link: '/knowledge-hub/pkm-foundations-zettelkasten-para-lyt',
    status: 'live',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-600/20 to-pink-600/20',
  },
  {
    icon: BrainCircuit,
    title: 'How to Build Your Second Brain',
    description: 'A step-by-step tutorial for implementing your chosen framework using popular tools like Obsidian or Logseq.',
    link: '#',
    status: 'soon',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-600/20 to-emerald-600/20',
  }
];

const tools = [
  {
    icon: BotMessageSquare,
    name: "AI Note Summarizer",
    description: "Paste any note or article. Get a perfect, one-paragraph summary in seconds.",
    href: "/tools/summarizer",
    status: 'live',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-600/20 to-indigo-600/20',
  },
  {
    icon: CaseUpper,
    name: "AI Title Generator",
    description: "Struggling with a title? Get a list of compelling, creative titles for your content.",
    href: "/tools/title-generator",
    status: 'live',
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-600/20 to-violet-600/20',
  },
  {
    icon: Tags,
    name: "AI Tag Suggester",
    description: "Input your text, get 5-10 relevant tags to categorize your knowledge.",
    href: "/tools/tag-suggester",
    status: 'live',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-600/20 to-red-600/20',
  },
  {
    icon: ListTodo,
    name: "AI Action-Item Extractor",
    description: "Find all the to-dos and action items from your meeting notes automatically.",
    href: "/tools/action-extractor",
    status: 'live',
    gradient: 'from-green-500 to-teal-500',
    bgGradient: 'from-green-600/20 to-teal-600/20',
  },
];

const ToolkitSection = () => {
  return (
    <section id="toolkit" className="w-full py-24 sm:py-32 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Your Free PKM Toolkit
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            A curated collection of in-depth guides and AI-powered utilities to build your Second Brain. 
            Everything you need to transform scattered notes into structured knowledge.
          </p>
        </div>
        
        {/* In-Depth Guides Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              📚 Master the Frameworks
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn the proven systems that knowledge workers use to organize their thinking and boost productivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Link 
                key={guide.title} 
                href={guide.link} 
                className="group block relative overflow-hidden"
              >
                <div className={`relative p-8 bg-gradient-to-br ${guide.bgGradient} backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2`}>
                  {/* Status Badge */}
                  {guide.status === 'soon' && (
                    <div className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold text-amber-300 bg-amber-900/30 border border-amber-500/30 rounded-full">
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${guide.gradient} shadow-lg mb-6`}>
                    <guide.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {guide.title}
                  </h4>
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {guide.description}
                  </p>
                  
                  {/* Read More Link */}
                  <div className="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span>Read Guide</span>
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Micro-Tools Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              🛠️ AI-Powered Utilities
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Automate the tedious parts of knowledge management. Let AI handle the heavy lifting while you focus on thinking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link 
                key={tool.name} 
                href={tool.href} 
                className="group block relative overflow-hidden"
              >
                <div className={`relative p-6 bg-gradient-to-br ${tool.bgGradient} backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2`}>
                  {/* Status Badge */}
                  {tool.status === 'soon' && (
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold text-amber-300 bg-amber-900/30 border border-amber-500/30 rounded-full">
                      Soon
                    </div>
                  )}
                  
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg mb-4`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {tool.name}
                  </h4>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  
                  {/* Try Now Link */}
                  <div className="flex items-center text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span>{tool.status === 'live' ? 'Try Now' : 'Coming Soon'}</span>
                    {tool.status === 'live' && (
                      <svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-full mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-400 font-medium">All tools are free forever • No signup required</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/workbench"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Try Advanced AI Workbench
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              View All AI Tools
            </Link>
            
            <Link
              href="/knowledge-hub"
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600 hover:border-slate-500 backdrop-blur-sm"
            >
              Browse All Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolkitSection; 