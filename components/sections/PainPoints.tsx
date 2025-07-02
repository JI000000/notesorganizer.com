import { CheckCircle2 } from "lucide-react";

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
          
          <div className="flex flex-col h-96 items-center justify-center rounded-2xl bg-slate-800/50 border border-white/10 p-8">
            <div className="flex w-full items-center justify-around">
              {/* Left side: Scattered Notes */}
              <div className="w-1/3 grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-700 rounded-lg w-fit text-sm">📄</div>
                <div className="p-2 bg-gray-700 rounded-lg w-fit mt-3 text-sm">🗒️</div>
                <div className="p-2 bg-gray-700 rounded-lg w-fit ml-4 text-sm">📑</div>
                <div className="p-2 bg-gray-700 rounded-lg w-fit mt-2 ml-1 text-sm">📋</div>
                <div className="p-2 bg-gray-700 rounded-lg w-fit text-sm">📝</div>
              </div>
              
              {/* Middle: Arrow */}
              <div className="w-1/3 flex justify-center">
                <svg width="64" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M2 16H62M62 16L46 2M62 16L46 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Right side: Structured Knowledge */}
              <div className="w-1/3 h-32 bg-gray-900/50 rounded-lg p-2 border border-white/10">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Nodes */}
                    <circle cx="20" cy="20" r="5" fill="#3b82f6" />
                    <circle cx="80" cy="30" r="5" fill="#3b82f6" />
                    <circle cx="50" cy="50" r="7" fill="#3b82f6" />
                    <circle cx="30" cy="80" r="5" fill="#3b82f6" />
                    <circle cx="70" cy="90" r="5" fill="#3b82f6" />

                    {/* Connections */}
                    <path d="M22 24 L46 46" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
                    <path d="M54 48 L76 34" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
                    <path d="M48 57 L34 76" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
                    <path d="M53 55 L68 86" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
                    <path d="M24 23 L78 28" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.2" />
                    <path d="M23 78 L78 33" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.2" />
                 </svg>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-400 text-center">From scattered notes to a structured knowledge base.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 