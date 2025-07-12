import Link from "next/link";
import { BookText, Tags, ListTodo, Type, CaseUpper, ArrowRight, Users, Lightbulb, ChevronRight, Star } from "lucide-react";

const tools = [
  {
    name: "AI Note Summarizer",
    description: "Paste any note or article. Get a perfect, one-paragraph summary in seconds.",
    href: "/tools/summarizer",
    icon: BookText,
    status: "live",
    difficulty: "Beginner",
    useCases: ["Quick reviews", "Content curation", "Information filtering"],
    userType: "Content creators, researchers, students"
  },
  {
    name: "AI Title Generator",
    description: "Struggling with a title? Get a list of compelling, creative titles for your content.",
    href: "/tools/title-generator",
    icon: CaseUpper,
    status: "live",
    difficulty: "Beginner",
    useCases: ["Blog posts", "Research papers", "Meeting notes"],
    userType: "Writers, bloggers, knowledge workers"
  },
  {
    name: "AI Tag Suggester",
    description: "Input your text, get 5-10 relevant tags to categorize your knowledge.",
    href: "/tools/tag-suggester",
    icon: Tags,
    status: "live",
    difficulty: "Beginner",
    useCases: ["Content organization", "Knowledge categorization", "Search optimization"],
    userType: "All users"
  },
  {
    name: "AI Action-Item Extractor",
    description: "Find all the to-dos and action items from your meeting notes automatically.",
    href: "/tools/action-extractor",
    icon: ListTodo,
    status: "live",
    difficulty: "Intermediate",
    useCases: ["Meeting notes", "Project planning", "Task management"],
    userType: "Project managers, team leads"
  },
];

const advancedTools = [
  {
    name: "AI Workbench",
    description: "Upload your entire note collection and get AI-powered organization, tagging, and knowledge graph analysis.",
    href: "/workbench",
    icon: "🚀",
    status: "live",
    difficulty: "Advanced",
    useCases: ["Knowledge base cleanup", "Note organization", "Knowledge discovery"],
    userType: "Power users, researchers"
  },
  {
    name: "Collaboration Hub",
    description: "Digital sticky notes workspace for team brainstorming and collaborative knowledge building.",
    href: "/collaboration-hub",
    icon: "👥",
    status: "live",
    difficulty: "Intermediate",
    useCases: ["Team brainstorming", "Visual collaboration", "Idea organization"],
    userType: "Teams, educators"
  },
  {
    name: "Research Notes",
    description: "Professional research management system with AI insights and project organization.",
    href: "/research-notes",
    icon: "📚",
    status: "live",
    difficulty: "Advanced",
    useCases: ["Academic research", "Market analysis", "Long-term projects"],
    userType: "Researchers, analysts"
  },
];

const userJourneys = [
  {
    title: "🎯 Beginner Path",
    description: "First time using PKM tools",
    flow: [
      { tool: "AI Note Summarizer", reason: "Learn to extract key information" },
      { tool: "AI Title Generator", reason: "Practice creating meaningful titles" },
      { tool: "AI Tag Suggester", reason: "Understand content categorization" },
      { tool: "Collaboration Hub", reason: "Experience visual knowledge organization" }
    ]
  },
  {
    title: "📝 Content Creator",
    description: "Writing and content production",
    flow: [
      { tool: "AI Title Generator", reason: "Create compelling headlines" },
      { tool: "AI Note Summarizer", reason: "Quickly organize research materials" },
      { tool: "AI Tag Suggester", reason: "Optimize content categorization" },
      { tool: "Action-Item Extractor", reason: "Extract tasks from content planning" }
    ]
  },
  {
    title: "🔬 Researcher",
    description: "Academic research and data analysis",
    flow: [
      { tool: "Research Notes", reason: "Organize research projects systematically" },
      { tool: "AI Workbench", reason: "Analyze large document collections" },
      { tool: "Action-Item Extractor", reason: "Extract tasks from meeting notes" },
      { tool: "Collaboration Hub", reason: "Team collaboration and discussion" }
    ]
  }
];

export default function ToolsPage() {
  return (
    <>
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100 mb-6">
            AI-Powered Knowledge Tools
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            From basic tools to advanced systems, a complete toolkit for building and managing your knowledge base
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">4</div>
              <div className="text-sm text-gray-400">AI Micro-Tools</div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <div className="text-sm text-gray-400">Advanced Systems</div>
            </div>
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-sm text-gray-400">User Satisfaction</div>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">Free</div>
              <div className="text-sm text-gray-400">All Tools</div>
            </div>
          </div>
        </div>

        {/* User Journey Guide */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-8">
            Choose Your Learning Path
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {userJourneys.map((journey, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{journey.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{journey.description}</p>
                <div className="space-y-3">
                  {journey.flow.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-200">{step.tool}</div>
                        <div className="text-xs text-gray-500">{step.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basic AI Tools */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-100">
              🎯 Basic AI Tools
            </h2>
            <span className="text-sm text-gray-400">Perfect for all users</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.name} className="group">
                <Link href={tool.href}>
                  <div className="block p-6 bg-slate-800/50 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative hover:transform hover:scale-[1.02]">
                    {tool.status === 'soon' && (
                      <div className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-700/30 rounded-full">
                        Coming Soon
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <tool.icon className="h-10 w-10 text-blue-500" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                          {tool.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-300 mb-2">Use Cases:</div>
                      <div className="flex flex-wrap gap-2">
                        {tool.useCases.map((useCase, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <span className="font-medium">Target Users:</span> {tool.userType}
                    </div>
                    {tool.status === 'live' && (
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm">Try Now</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Tools */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-100">
              🚀 Advanced Tool Systems
            </h2>
            <span className="text-sm text-gray-400">For power users</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {advancedTools.map((tool) => (
              <div key={tool.name} className="group">
                <Link href={tool.href}>
                  <div className="block p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative hover:transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">{tool.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-purple-700/30 px-2 py-1 rounded">
                          {tool.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-300 mb-2">Core Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {tool.useCases.map((useCase, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <span className="font-medium">Target Users:</span> {tool.userType}
                    </div>
                    <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span className="text-sm">Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Knowledge Management Journey?
          </h3>
          <p className="text-gray-300 mb-6">
            Choose a tool that fits your needs, or start with our recommended learning path
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/summarizer">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Start with Basic Tools
              </button>
            </Link>
            <Link href="/workbench">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                Try AI Workbench
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 