import { CheckCircle2, AlertTriangle, FolderOpen, Search, Clock, Headphones } from "lucide-react";

const painPoints = [
  "Notes scattered across 5 different apps.",
  "Great ideas lost in a sea of unstructured text.",
  `Your "Second Brain" feels more like a "Second Junk Drawer".`,
  "You write things down but can never find them again.",
];

export default function PainPoints() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Does This Sound Familiar?
            </h2>
            
            <ul className="mt-8 space-y-4">
              {painPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg text-gray-300">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-xl leading-8 text-gray-300">
              You&apos;re not disorganized. You just lack a system. At NotesOrganizer, we believe effective knowledge management isn&apos;t about finding another &quot;perfect&quot; app—it&apos;s about implementing the right framework. We&apos;re here to teach you that framework, for free.
            </p>
          </div>
          
          {/* 简化的痛点可视化 */}
          <div className="relative">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
              <h3 className="text-lg font-semibold text-white mb-6 text-center">The Knowledge Management Chaos</h3>
              
              {/* 散乱的应用图标 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center transform rotate-[-2deg]">
                  <FolderOpen className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <span className="text-xs text-red-300">Files App</span>
                  <div className="text-[10px] text-gray-400 mt-1">127 notes</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center transform rotate-[3deg]">
                  <div className="w-6 h-6 bg-blue-400 rounded mx-auto mb-2 text-xs flex items-center justify-center text-white font-bold">N</div>
                  <span className="text-xs text-blue-300">Notion</span>
                  <div className="text-[10px] text-gray-400 mt-1">89 pages</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center transform rotate-[-1deg]">
                  <div className="w-6 h-6 bg-purple-400 rounded mx-auto mb-2 text-xs flex items-center justify-center text-white font-bold">O</div>
                  <span className="text-xs text-purple-300">Obsidian</span>
                  <div className="text-[10px] text-gray-400 mt-1">203 notes</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center transform rotate-[2deg]">
                  <div className="w-6 h-6 bg-green-400 rounded mx-auto mb-2 text-xs flex items-center justify-center text-white font-bold">E</div>
                  <span className="text-xs text-green-300">Evernote</span>
                  <div className="text-[10px] text-gray-400 mt-1">156 notes</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center transform rotate-[-3deg]">
                  <div className="w-6 h-6 bg-yellow-400 rounded mx-auto mb-2 text-xs flex items-center justify-center text-white font-bold">📝</div>
                  <span className="text-xs text-yellow-300">Apple Notes</span>
                  <div className="text-[10px] text-gray-400 mt-1">342 notes</div>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 text-center transform rotate-[1deg]">
                  <Headphones className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <span className="text-xs text-orange-300">Voice Memos</span>
                  <div className="text-[10px] text-gray-400 mt-1">67 recordings</div>
                </div>
              </div>

              {/* 问题标签 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Can&apos;t find that important meeting note from last week</span>
                </div>
                <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <Search className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Search results in 5 different apps, no connections</span>
                </div>
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Spend more time organizing than actually thinking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 