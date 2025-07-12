'use client'

import { useState } from 'react'
import { Tags, Copy, Check, Lightbulb, Zap, Target, BookOpen } from 'lucide-react'
import Link from 'next/link'

type TagSuggestion = {
  tag: string;
  confidence: number;
  category: string;
}

type TagResponse = {
  tags: TagSuggestion[];
}

const examples = [
  {
    title: "Project Management Notes",
    content: "Our team completed the Q4 sprint planning session. We identified key deliverables including the new user dashboard, API optimization, and mobile app improvements. The main challenges are resource allocation and timeline management. We need to prioritize user experience enhancements while maintaining system stability.",
    expectedTags: ["#project-management", "#sprint-planning", "#deliverables", "#resource-allocation", "#user-experience"]
  },
  {
    title: "Research Article Summary",
    content: "This study investigates the impact of remote work on employee productivity and mental health. The research methodology included surveys from 500 participants and statistical analysis. Key findings show that flexible work arrangements improve work-life balance but may reduce team collaboration. Remote workers report higher job satisfaction but occasional feelings of isolation.",
    expectedTags: ["#remote-work", "#productivity", "#mental-health", "#work-life-balance", "#research-methodology"]
  },
  {
    title: "Learning Notes",
    content: "Today I learned about React hooks, particularly useEffect and useState. The useEffect hook manages side effects in functional components, while useState allows state management without class components. These hooks simplify component logic and improve code readability. I practiced implementing a todo list application using these concepts.",
    expectedTags: ["#react", "#hooks", "#useEffect", "#useState", "#web-development"]
  }
]

export default function TagSuggesterPage() {
  const [text, setText] = useState('')
  const [tags, setTags] = useState<TagSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedTags, setCopiedTags] = useState<string[]>([])
  const [showExamples, setShowExamples] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setTags([])

    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate tags')
      }

      const data: TagResponse = await response.json()
      setTags(data.tags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyTag = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(tag)
      setCopiedTags([...copiedTags, tag])
      setTimeout(() => {
        setCopiedTags(copiedTags.filter(t => t !== tag))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy tag:', err)
    }
  }

  const copyAllTags = async () => {
    const allTags = tags.map(t => t.tag).join(' ')
    try {
      await navigator.clipboard.writeText(allTags)
      setCopiedTags(tags.map(t => t.tag))
      setTimeout(() => {
        setCopiedTags([])
      }, 2000)
    } catch (err) {
      console.error('Failed to copy all tags:', err)
    }
  }

  const loadExample = (example: typeof examples[0]) => {
    setText(example.content)
    setTags([])
    setError('')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-300'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-700',
      'Learning': 'bg-purple-100 text-purple-700',
      'Workflow': 'bg-green-100 text-green-700',
      'Strategy': 'bg-red-100 text-red-700',
      'Communication': 'bg-orange-100 text-orange-700',
      'Research': 'bg-indigo-100 text-indigo-700',
      'Business': 'bg-gray-100 text-gray-700',
      'Creative': 'bg-pink-100 text-pink-700',
      'Personal': 'bg-teal-100 text-teal-700',
      'Systems': 'bg-cyan-100 text-cyan-700',
      'Methods': 'bg-lime-100 text-lime-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            ← Back to Tools
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tags className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">AI Tag Suggester</h1>
          </div>
          <p className="text-xl text-gray-300">
            Transform your content into organized, searchable knowledge with intelligent tag suggestions
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            How to Use This Tool
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold">Paste Your Content</h3>
                <p className="text-sm text-gray-400">Add your notes, articles, or any text content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold">Generate Tags</h3>
                <p className="text-sm text-gray-400">AI analyzes and suggests relevant tags</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold">Copy & Organize</h3>
                <p className="text-sm text-gray-400">Use tags to categorize your knowledge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">Input Your Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your content here... (blog post, meeting notes, research, etc.)"
                  className="w-full h-48 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${text.length > 1800 ? 'text-red-400' : 'text-gray-400'}`}>
                    {text.length}/2000 characters
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {showExamples ? 'Hide' : 'Show'} Examples
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || text.length < 50}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Tags
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Generated Tags</h2>
              {tags.length > 0 && (
                <button
                  onClick={copyAllTags}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </button>
              )}
            </div>

            {tags.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Enter your content and click &quot;Generate Tags&quot; to get started
                </p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="space-y-3">
                {tags.map((tagItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg">{tagItem.tag}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(tagItem.category)}`}>
                        {tagItem.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getConfidenceColor(tagItem.confidence)}`}>
                        {Math.round(tagItem.confidence * 100)}%
                      </span>
                    </div>
                    <button
                      onClick={() => copyTag(tagItem.tag)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      {copiedTags.includes(tagItem.tag) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        {showExamples && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-400" />
              Try These Examples
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {examples.map((example, index) => (
                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="font-semibold mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-3">{example.content}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {example.expectedTags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => loadExample(example)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors"
                  >
                    Try This Example
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Pro Tips for Better Tags</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-400">✅ Best Practices</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Include context about your content&apos;s purpose</li>
                <li>• Add domain-specific terminology</li>
                <li>• Mention key concepts and methodologies</li>
                <li>• Include relevant project or category names</li>
                <li>• Provide enough detail for meaningful analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-400">❌ Avoid These</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Very short or incomplete sentences</li>
                <li>• Lists without context</li>
                <li>• Overly technical jargon without explanation</li>
                <li>• Personal information or sensitive data</li>
                <li>• Random text or placeholder content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 