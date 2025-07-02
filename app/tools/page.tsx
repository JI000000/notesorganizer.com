import Link from "next/link";
import { BookText, Tags, ListTodo, Type, CaseUpper } from "lucide-react";

const tools = [
  {
    name: "AI Note Summarizer",
    description: "Paste any note or article. Get a perfect, one-paragraph summary in seconds.",
    href: "/tools/summarizer",
    icon: BookText,
    status: "live",
  },
  {
    name: "AI Title Generator",
    description: "Struggling with a title? Get a list of compelling, creative titles for your content.",
    href: "/tools/title-generator",
    icon: CaseUpper,
    status: "live",
  },
  {
    name: "AI Tag Suggester",
    description: "Input your text, get 5-10 relevant tags to categorize your knowledge.",
    href: "#",
    icon: Tags,
    status: "soon",
  },
  {
    name: "AI Action-Item Extractor",
    description: "Find all the to-dos and action items from your meeting notes automatically.",
    href: "#",
    icon: ListTodo,
    status: "soon",
  },
];

export default function ToolsPage() {
  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100">
            AI Micro-Tools
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Automate the tedious parts of Personal Knowledge Management.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <div className="block p-8 bg-slate-800/50 dark:bg-slate-800/50 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full relative">
                {tool.status === 'soon' && (
                  <div className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-full">
                    Coming Soon
                  </div>
                )}
                <tool.icon className="h-10 w-10 text-blue-500" />
                <h3 className="mt-4 text-xl font-bold text-gray-100">
                  {tool.name}
                </h3>
                <p className="mt-2 text-gray-400">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
} 