'use client'

import { useState } from 'react'
import { ListTodo, Copy, Check, Lightbulb, Zap, Calendar, User, AlertCircle, Target, BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type ActionItem = {
  id: number;
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  category: string;
  context: string;
}

type ActionSummary = {
  totalItems: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  categories: string[];
}

type ActionResponse = {
  actionItems: ActionItem[];
  summary: ActionSummary;
}

const examples = [
  {
    title: "Team Meeting Notes",
    content: "Team meeting Q1 planning session. Sarah will follow up with design team on new UI mockups by next Friday. Mike needs to schedule user testing sessions for the dashboard feature within two weeks. We need to update the project timeline and share with stakeholders by end of this week. John mentioned he'll research integration options for the new API. The CEO wants a progress report on the mobile app by January 15th.",
    expectedActions: ["Follow up with design team", "Schedule user testing", "Update project timeline", "Research API integration", "Prepare progress report"]
  },
  {
    title: "Project Review Notes",
    content: "Project review meeting outcomes: Development team needs to fix the authentication bug reported by QA team. Priority is high due to security concerns. Marketing team should prepare launch materials for the new feature by end of month. We need to coordinate with the legal team on privacy policy updates. Schedule follow-up meeting with stakeholders for next Tuesday.",
    expectedActions: ["Fix authentication bug", "Prepare launch materials", "Coordinate privacy policy updates", "Schedule stakeholder meeting"]
  },
  {
    title: "Research Planning",
    content: "Research planning discussion: We need to conduct user interviews to understand current pain points. Alice will reach out to five existing customers by next week. The UX team should prepare interview questions and user journey maps. We need to analyze competitor features and pricing models. Create a research timeline and present findings to the executive team.",
    expectedActions: ["Conduct user interviews", "Prepare interview questions", "Analyze competitor features", "Create research timeline", "Present findings"]
  }
]

export default function ActionExtractorPage() {
  const [text, setText] = useState('')
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [summary, setSummary] = useState<ActionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedItems, setCopiedItems] = useState<number[]>([])
  const [showExamples, setShowExamples] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setActionItems([])
    setSummary(null)

    try {
      const response = await fetch('/api/extract-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract action items')
      }

      const data: ActionResponse = await response.json()
      setActionItems(data.actionItems)
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyActionItem = async (item: ActionItem) => {
    const formattedItem = `Task: ${item.task}\nAssignee: ${item.assignee}\nPriority: ${item.priority}\nDeadline: ${item.deadline}\nCategory: ${item.category}\nContext: ${item.context}`
    
    try {
      await navigator.clipboard.writeText(formattedItem)
      setCopiedItems([...copiedItems, item.id])
      setTimeout(() => {
        setCopiedItems(copiedItems.filter(id => id !== item.id))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy action item:', err)
    }
  }

  const copyAllItems = async () => {
    const allItems = actionItems.map(item => 
      `${item.id}. ${item.task} (${item.assignee}) - ${item.priority} priority - Due: ${item.deadline}`
    ).join('\n')
    
    try {
      await navigator.clipboard.writeText(allItems)
      setCopiedItems(actionItems.map(item => item.id))
      setTimeout(() => {
        setCopiedItems([])
      }, 2000)
    } catch (err) {
      console.error('Failed to copy all items:', err)
    }
  }

  const loadExample = (example: typeof examples[0]) => {
    setText(example.content)
    setActionItems([])
    setSummary(null)
    setError('')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Design': 'bg-purple-100 text-purple-700',
      'Research': 'bg-blue-100 text-blue-700',
      'Planning': 'bg-green-100 text-green-700',
      'Technical': 'bg-orange-100 text-orange-700',
      'Communication': 'bg-pink-100 text-pink-700',
      'General': 'bg-gray-100 text-gray-700',
    }
    return colors[category] || 'bg-indigo-100 text-indigo-700'
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
            <ListTodo className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold">Action-Item Extractor</h1>
          </div>
          <p className="text-xl text-gray-300">
            Never miss a follow-up again. Extract actionable tasks from your meeting notes and documents
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
                <p className="text-sm text-gray-400">Add meeting notes, project updates, or any text</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold">Extract Actions</h3>
                <p className="text-sm text-gray-400">AI identifies tasks, deadlines, and responsibilities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold">Stay Organized</h3>
                <p className="text-sm text-gray-400">Copy to your task management system</p>
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
                  placeholder="Paste your meeting notes, project updates, or any text with action items..."
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
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Extracting Actions...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Extract Action Items
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
              <h2 className="text-2xl font-semibold">Action Items</h2>
              {actionItems.length > 0 && (
                <button
                  onClick={copyAllItems}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </button>
              )}
            </div>

            {/* Summary Stats */}
            {summary && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-2xl font-bold text-blue-400">{summary.totalItems}</div>
                  <div className="text-sm text-gray-400">Total Items</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-2xl font-bold text-red-400">{summary.highPriority}</div>
                  <div className="text-sm text-gray-400">High Priority</div>
                </div>
              </div>
            )}

            {actionItems.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Enter your content and click &quot;Extract Action Items&quot; to get started
                </p>
              </div>
            )}

            {actionItems.length > 0 && (
              <div className="space-y-4">
                {actionItems.map((item) => (
                  <div key={item.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{item.task}</h3>
                        <p className="text-sm text-gray-400 mb-3">{item.context}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyActionItem(item)}
                        className="text-blue-400 hover:text-blue-300 p-1 ml-2"
                      >
                        {copiedItems.includes(item.id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {item.assignee}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.deadline}
                      </div>
                    </div>
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
                    {example.expectedActions.map((action, actionIndex) => (
                      <span key={actionIndex} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {action}
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
          <h2 className="text-2xl font-semibold mb-4">Tips for Better Action Item Extraction</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-400">✅ What Works Best</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Include names and responsibilities</li>
                <li>• Mention deadlines and time frames</li>
                <li>• Use action verbs (create, schedule, follow up)</li>
                <li>• Provide context about the project or meeting</li>
                <li>• Include priority indicators or urgency cues</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-400">❌ What to Avoid</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Vague or incomplete task descriptions</li>
                <li>• Lists without context or ownership</li>
                <li>• Passive language without clear actions</li>
                <li>• Missing information about who or when</li>
                <li>• Too much irrelevant detail</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 