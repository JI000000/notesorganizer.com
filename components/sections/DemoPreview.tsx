import { Play, Zap, BrainCircuit, Shield, FileText, Link2, BarChart3, ArrowRight, Upload, Search, Sparkles, Users, MessageSquare, CheckCircle } from 'lucide-react';

const DemoPreview = () => {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
      <div className="container mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            See It In Action
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            From messy notes to organized knowledge in 3 simple steps. Watch how our platform transforms your workflow from chaos to clarity.
          </p>
        </div>

        {/* 工作流程演示 - 便利贴风格 */}
        <div className="mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Step 1: Upload */}
              <div className="relative">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 h-full">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">1. Upload Your Notes</h3>
                    <p className="text-gray-400 text-sm">Drag and drop your scattered files from anywhere</p>
                  </div>
                  
                  {/* 便利贴风格的文件展示 */}
                  <div className="space-y-3">
                    <div className="bg-yellow-200 p-3 rounded-lg transform rotate-[-2deg] shadow-lg">
                      <div className="text-xs text-gray-800 font-medium mb-1">📄 meeting-notes.md</div>
                      <div className="text-[10px] text-gray-600">Client requirements discussion...</div>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-lg transform rotate-[1deg] shadow-lg">
                      <div className="text-xs text-gray-800 font-medium mb-1">💡 project-ideas.txt</div>
                      <div className="text-[10px] text-gray-600">AI-powered knowledge tool...</div>
                    </div>
                    <div className="bg-green-200 p-3 rounded-lg transform rotate-[-1deg] shadow-lg">
                      <div className="text-xs text-gray-800 font-medium mb-1">📊 research-data.docx</div>
                      <div className="text-[10px] text-gray-600">Market analysis findings...</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-400">Supports 20+ formats</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: AI Analysis */}
              <div className="relative">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 h-full">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">2. AI Processes</h3>
                    <p className="text-gray-400 text-sm">Advanced AI extracts insights and connections</p>
                  </div>
                  
                  {/* AI 处理过程可视化 */}
                  <div className="relative">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-purple-400">AI Analysis</span>
                        <div className="flex items-center gap-1">
                          <BrainCircuit className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-400">Processing...</span>
                        </div>
                      </div>
                      
                      {/* 处理进度 */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-gray-300">Extract key concepts</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-gray-300">Identify relationships</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-gray-300">Generate categories</span>
                        </div>
                      </div>
                      
                      {/* 发现的概念标签 */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">AI Tools</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">PKM</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Productivity</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span className="text-xs text-purple-400">Processes 1000+ notes/min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Explore & Collaborate */}
              <div className="relative">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 h-full">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">3. Explore & Share</h3>
                    <p className="text-gray-400 text-sm">Navigate knowledge maps and collaborate with team</p>
                  </div>
                  
                  {/* 协作场景 - 便利贴风格 */}
                  <div className="relative bg-slate-900/50 rounded-lg p-4 border border-green-500/30">
                    {/* 便利贴协作场景 */}
                    <div className="relative h-32">
                      <div className="absolute top-2 left-2 w-20 h-16 bg-yellow-200 rounded shadow-lg transform rotate-[-5deg] p-2">
                        <div className="text-[8px] text-gray-800 font-medium">Strategy</div>
                        <div className="text-[6px] text-gray-600 mt-1">Q1 roadmap</div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                      </div>
                      
                      <div className="absolute top-4 right-4 w-20 h-16 bg-blue-200 rounded shadow-lg transform rotate-[3deg] p-2">
                        <div className="text-[8px] text-gray-800 font-medium">Research</div>
                        <div className="text-[6px] text-gray-600 mt-1">User feedback</div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      </div>
                      
                      <div className="absolute bottom-2 left-6 w-20 h-16 bg-pink-200 rounded shadow-lg transform rotate-[1deg] p-2">
                        <div className="text-[8px] text-gray-800 font-medium">Ideas</div>
                        <div className="text-[6px] text-gray-600 mt-1">New features</div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-white"></div>
                      </div>
                      
                      {/* 连接线 */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <path d="M15 25 Q35 15 55 35" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeDasharray="3,3" opacity="0.6" />
                        <path d="M25 55 Q45 45 65 25" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeDasharray="3,3" opacity="0.6" />
                      </svg>
                    </div>
                    
                    {/* 协作指示器 */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">3 online</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400">5 comments</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-600/10 border border-green-500/20 rounded-full">
                      <Link2 className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Real-time collaboration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Process thousands of notes in minutes, not hours. Our AI works at superhuman speed.</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Analysis</h3>
            <p className="text-gray-400">Advanced AI understands context, extracts key concepts, and identifies hidden connections.</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy Protected</h3>
            <p className="text-gray-400">Your knowledge stays yours. No data mining, no tracking, no compromises.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-400 font-medium">Free tier available - No credit card required</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/workbench"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Try AI Workbench
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/collaboration-hub"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-600/50 hover:border-blue-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Try Collaboration Hub
              <Users className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoPreview; 