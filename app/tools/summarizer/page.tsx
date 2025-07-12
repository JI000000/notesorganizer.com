'use client';

import { useState } from 'react';
import { BookOpen, Lightbulb, CheckCircle, AlertCircle, Users, Clock, FileText } from 'lucide-react';

const examples = [
  {
    title: "Meeting Notes",
    description: "Transform lengthy meeting notes into actionable summaries",
    input: `Team Meeting - Q4 Planning Session
Date: October 15, 2024
Attendees: Sarah (PM), Mike (Dev), Lisa (Design), John (QA)

Sarah opened the meeting discussing our Q4 roadmap priorities. We need to focus on three main areas: user onboarding improvements, performance optimization, and the new collaboration features.

Mike presented the technical challenges for the collaboration features. The main issues are real-time synchronization and conflict resolution. He estimates 6-8 weeks for completion, including testing.

Lisa shared the new onboarding designs. User testing showed 40% improvement in completion rates. She recommends A/B testing the new flow with 20% of users first.

John raised concerns about our current testing coverage. We&apos;re at 65% code coverage and need to reach 80% before the collaboration feature launch.

Next steps: Sarah will create detailed tickets for each feature. Mike will start on the sync architecture. Lisa will prepare A/B test specifications. John will work on improving test coverage.

Meeting ended at 3:30 PM. Next meeting scheduled for October 22.`,
    expectedOutput: "This Q4 planning meeting covered three priorities: onboarding improvements, performance optimization, and collaboration features. Key decisions include implementing Lisa's new onboarding designs through A/B testing (showing 40% improvement), Mike's 6-8 week timeline for collaboration features, and John's goal to increase test coverage from 65% to 80%. Next steps are assigned to team members with a follow-up meeting scheduled for October 22."
  },
  {
    title: "Research Article",
    description: "Distill academic papers into key findings",
    input: `The Impact of Knowledge Management Systems on Organizational Learning

Abstract: This study examines how knowledge management systems (KMS) influence organizational learning processes in medium to large enterprises. Through a mixed-methods approach involving 150 companies across various industries, we analyzed the correlation between KMS implementation and learning outcomes.

Methodology: We conducted surveys with 150 organizations and in-depth interviews with 45 knowledge managers. The study measured learning effectiveness using the Organizational Learning Capability Scale (OLCS) and KMS maturity using the Knowledge Management Maturity Model (KM3).

Key Findings:
1. Organizations with mature KMS showed 34% higher learning capability scores
2. Companies that integrated AI-powered features saw 28% faster knowledge retrieval
3. Cross-departmental knowledge sharing increased by 42% with collaborative KMS features
4. Employee satisfaction with knowledge access improved by 56% post-implementation

The study also revealed that successful KMS implementation requires strong leadership support, adequate training programs, and clear governance structures. Organizations that neglected these factors showed significantly lower adoption rates and learning outcomes.

Conclusion: Knowledge management systems significantly enhance organizational learning when properly implemented with appropriate supporting structures and leadership commitment.`,
    expectedOutput: "This research study of 150 companies found that mature knowledge management systems significantly boost organizational learning. Key findings include 34% higher learning capability scores, 28% faster knowledge retrieval with AI features, 42% increase in cross-departmental sharing, and 56% improvement in employee satisfaction. Success factors include strong leadership support, adequate training, and clear governance structures."
  },
  {
    title: "Personal Notes",
    description: "Summarize personal learning notes and insights",
    input: `Learning Notes: React Performance Optimization

Today I dove deep into React performance optimization techniques. Here's what I learned:

Memo and useMemo:
- React.memo prevents unnecessary re-renders for functional components
- useMemo memoizes expensive calculations
- Only use when you have actual performance issues, not preemptively

useCallback:
- Memoizes function references to prevent child re-renders
- Useful when passing callbacks to optimized child components
- Can actually hurt performance if overused

Code Splitting:
- React.lazy() and Suspense for component-level splitting
- Dynamic imports for route-based splitting
- Can reduce initial bundle size significantly

Virtual Lists:
- For large datasets, only render visible items
- Libraries like react-window or react-virtualized
- Huge performance gains for lists with 1000+ items

Profiling:
- React DevTools Profiler shows component render times
- Chrome DevTools for memory leaks and general performance
- lighthouse for overall app performance metrics

Key insight: Always measure before optimizing. Many "performance improvements" actually make things worse or have no effect.`,
    expectedOutput: "These React performance optimization notes cover five key techniques: memoization with React.memo and useMemo/useCallback (use only when needed), code splitting with React.lazy for reducing bundle size, virtual lists for large datasets (1000+ items), and profiling with React DevTools and Chrome DevTools. The main insight is to always measure performance before optimizing, as premature optimization can be counterproductive."
  }
];

const tips = [
  {
    icon: FileText,
    title: "Input Length",
    description: "Works best with 100-2000 words. Longer texts get truncated."
  },
  {
    icon: CheckCircle,
    title: "Structure Matters",
    description: "Well-structured content with headings and bullet points produces better summaries."
  },
  {
    icon: Clock,
    title: "Processing Time",
    description: "Most summaries are generated within 3-5 seconds."
  },
  {
    icon: Users,
    title: "Use Cases",
    description: "Perfect for meeting notes, articles, research papers, and learning materials."
  }
];

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');
    setError('');

    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'An unexpected error occurred.');
      return;
    }

    const result = await response.json();
    setSummary(result.summary);
  };

  const loadExample = (example: typeof examples[0]) => {
    setText(example.input);
    setSelectedExample(examples.indexOf(example));
    setShowExamples(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white"> 
      <header className="py-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-b border-gray-800">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <BookOpen className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100 mb-4">
            AI Note Summarizer
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform lengthy content into concise, AI-powered summaries in seconds
          </p>
          
          {/* Quick Tips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {tips.map((tip, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <tip.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-200 mb-1">{tip.title}</div>
                <div className="text-xs text-gray-400">{tip.description}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 pb-8">
        {/* How to Use Section */}
        <div className="my-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">How to Use</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <div className="font-semibold text-blue-400 mb-2">1. Paste Your Content</div>
              <p>Copy and paste any text content - meeting notes, articles, research papers, or personal notes.</p>
            </div>
            <div>
              <div className="font-semibold text-green-400 mb-2">2. Click Summarize</div>
              <p>Our AI analyzes your content and extracts the key points and main ideas automatically.</p>
            </div>
            <div>
              <div className="font-semibold text-purple-400 mb-2">3. Use Your Summary</div>
              <p>Copy the summary for quick reviews, sharing with colleagues, or organizing your knowledge base.</p>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Example Inputs</h2>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
          </div>
          
          {showExamples && (
            <div className="grid gap-4 mb-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className={`bg-slate-800/50 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-800/70 ${
                    selectedExample === index ? 'border-blue-500' : 'border-slate-700/50'
                  }`}
                  onClick={() => loadExample(example)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{example.title}</h3>
                    <span className="text-xs text-blue-400">Click to load</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{example.description}</p>
                  <div className="text-xs text-gray-500">
                    Input length: ~{example.input.length} characters
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Tool Interface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={handleSubmit} className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-200">Input Text</label>
              <div className="text-sm text-gray-400">
                {text.length}/2000 characters
              </div>
            </div>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full h-96 p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-none text-gray-200"
              placeholder="Paste your text here... (meeting notes, articles, research papers, etc.)"
            ></textarea>
            
            {text.length > 2000 && (
              <div className="flex items-center gap-2 mt-2 text-sm text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                Text will be truncated to 2000 characters
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Summarizing...' : 'Summarize'}
            </button>
          </form>

          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-200">AI Summary</label>
              {summary && (
                <button
                  onClick={() => navigator.clipboard.writeText(summary)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Copy Summary
                </button>
              )}
            </div>
            <div className="w-full h-96 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
              <div className="flex-grow p-4 overflow-y-auto">
                {error && (
                  <div className="flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium mb-1">Error</div>
                      <div className="text-sm">{error}</div>
                    </div>
                  </div>
                )}
                {isLoading && !summary && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span>Analyzing your content...</span>
                  </div>
                )}
                {summary && (
                  <div className="text-gray-300 leading-relaxed">
                    {summary}
                  </div>
                )}
                {!error && !isLoading && !summary && (
                  <div className="text-gray-500 italic text-center mt-8">
                    Your AI-generated summary will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Better Results */}
        <div className="mt-12 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Tips for Better Results</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">✅ Best Practices</h4>
              <ul className="space-y-2">
                <li>• Use clear headings and structure in your text</li>
                <li>• Include context and background information</li>
                <li>• Keep important points in separate paragraphs</li>
                <li>• Use bullet points for lists and action items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">❌ Avoid These</h4>
              <ul className="space-y-2">
                <li>• Very short texts (under 50 words)</li>
                <li>• Content with lots of technical jargon without context</li>
                <li>• Mixed languages in the same text</li>
                <li>• Text that&apos;s mostly tables or code</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 