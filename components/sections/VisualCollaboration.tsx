import { Users, MessageCircle, GitBranch, Eye, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const VisualCollaboration = () => {
  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together on knowledge maps in real-time. See changes as they happen.",
      benefits: [
        "Multiple users can edit simultaneously",
        "Live cursors and presence indicators",
        "Instant sync across all devices"
      ]
    },
    {
      icon: MessageCircle,
      title: "Contextual Discussions",
      description: "Add comments and discussions directly to your knowledge nodes and connections.",
      benefits: [
        "Thread discussions on specific topics",
        "Mention team members for feedback",
        "Version history with comments"
      ]
    },
    {
      icon: GitBranch,
      title: "Knowledge Branching",
      description: "Create alternative knowledge structures without losing your original organization.",
      benefits: [
        "Experiment with different structures",
        "Merge successful branches back",
        "Keep multiple perspectives organized"
      ]
    },
    {
      icon: Eye,
      title: "Visual Knowledge Maps",
      description: "Transform abstract concepts into interactive, visual knowledge networks.",
      benefits: [
        "Drag-and-drop interface for easy editing",
        "Zoom and pan for detailed exploration",
        "Multiple view modes and layouts"
      ]
    }
  ];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Collaborative Knowledge Building
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto">
            Transform individual note-taking into collaborative knowledge creation. 
            Build shared understanding with your team through visual, interactive knowledge maps.
          </p>
        </div>

        {/* Main Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - Visual Demo */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                {/* Collaborative sticky notes simulation */}
                <div className="relative h-full">
                  {/* Sticky Note 1 */}
                  <div className="absolute top-4 left-4 w-32 h-24 bg-yellow-200 rounded-lg shadow-lg transform rotate-[-5deg] p-3">
                    <div className="text-xs text-gray-800 font-medium">Project Ideas</div>
                    <div className="text-[10px] text-gray-600 mt-1">• AI Newsletter<br/>• PKM Course</div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  {/* Sticky Note 2 */}
                  <div className="absolute top-8 right-8 w-32 h-24 bg-green-200 rounded-lg shadow-lg transform rotate-[8deg] p-3">
                    <div className="text-xs text-gray-800 font-medium">Research</div>
                    <div className="text-[10px] text-gray-600 mt-1">• User interviews<br/>• Competitor analysis</div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  {/* Sticky Note 3 */}
                  <div className="absolute bottom-8 left-8 w-32 h-24 bg-pink-200 rounded-lg shadow-lg transform rotate-[3deg] p-3">
                    <div className="text-xs text-gray-800 font-medium">Next Steps</div>
                    <div className="text-[10px] text-gray-600 mt-1">• Create wireframes<br/>• Set up analytics</div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                      </marker>
                    </defs>
                    <path d="M25 35 Q50 20 75 45" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.7" markerEnd="url(#arrowhead)" />
                    <path d="M25 65 Q50 80 75 55" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.7" markerEnd="url(#arrowhead)" />
                  </svg>
                  
                  {/* Floating comment bubble */}
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    <MessageCircle className="w-3 h-3 inline mr-1" />
                    3 comments
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 text-sm text-blue-400 font-medium">
                <Users className="w-4 h-4 inline mr-1" />
                3 collaborators
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full mb-6">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Coming Soon</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              From Post-it Notes to Digital Collaboration
            </h3>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Remember brainstorming sessions with sticky notes on whiteboards? We&apos;ve recreated that magic digitally. 
              Create, move, and connect ideas in real-time with your team, no matter where they are.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                "Real-time collaborative editing",
                "Infinite canvas for unlimited ideas",
                "Smart auto-save and sync",
                "Voice and video integration",
                "Export to your favorite tools"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/collaboration-hub"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/knowledge-hub"
                className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600 hover:border-slate-500"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-full mb-8">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-400 font-medium">Early access available to beta testers</span>
          </div>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to transform how your team collaborates on knowledge? Join our beta program and help shape the future of collaborative thinking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualCollaboration; 