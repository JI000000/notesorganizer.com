'use client'

import React, { useState } from 'react'
import { 
  BookOpen, ChevronRight, Upload, Zap, Download, 
  FileText, Network, BarChart3, Lightbulb, 
  CheckCircle, AlertCircle, Settings, Eye,
  Clock, Users, Shield, Target
} from 'lucide-react'

interface GuideStepProps {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
  tips?: string[]
}

const GuideStep: React.FC<GuideStepProps> = ({ icon, title, description, details, tips }) => (
  <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">{detail}</span>
            </div>
          ))}
        </div>
        
        {tips && tips.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Pro Tips</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
)

interface WorkbenchGuideProps {
  onClose?: () => void
}

const WorkbenchGuide: React.FC<WorkbenchGuideProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'features' | 'faq'>('guide')

  const guideSteps = [
    {
      icon: <Upload className="w-6 h-6 text-blue-400" />,
      title: "1. Upload Your Notes",
      description: "Start by uploading a ZIP file containing your markdown notes",
      details: [
        "Maximum file size: 5MB",
        "Supported formats: .md, .markdown, .txt files",
        "Organize files in folders for better categorization",
        "Ensure proper UTF-8 encoding for best results"
      ],
      tips: [
        "Use descriptive filenames for better organization",
        "Keep individual notes under 10,000 characters",
        "Remove duplicate or outdated notes before uploading"
      ]
    },
    {
      icon: <Zap className="w-6 h-6 text-green-400" />,
      title: "2. AI Analysis Process",
      description: "Our AI analyzes each note and builds connections between them",
      details: [
        "Content analysis: Extracts key topics, themes, and concepts",
        "Link suggestion: Identifies potential connections between notes",
        "Knowledge graph: Creates a visual map of your knowledge",
        "Health report: Provides insights about your knowledge base"
      ],
      tips: [
        "Processing time varies with the number of notes (1-10 minutes typical)",
        "You can close the browser - your progress is saved",
        "The system prioritizes quality over speed"
      ]
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      title: "3. Explore Your Results",
      description: "Review enhanced notes, discover connections, and explore your knowledge graph",
      details: [
        "Enhanced notes with improved titles and summaries",
        "Interactive knowledge graph visualization",
        "Suggested connections between related notes",
        "Comprehensive health report with actionable insights"
      ],
      tips: [
        "Start with the knowledge graph for a high-level overview",
        "Use the search function to find specific topics",
        "Review suggested connections to discover new relationships"
      ]
    },
    {
      icon: <Download className="w-6 h-6 text-orange-400" />,
      title: "4. Export & Use",
      description: "Download your enhanced notes and implement the suggestions",
      details: [
        "Download enhanced notes as a ZIP file",
        "Export knowledge graph as JSON or image",
        "Save health report as PDF",
        "Import suggestions into your note-taking app"
      ],
      tips: [
        "Review all suggestions before implementing",
        "Start with high-confidence connections",
        "Keep the original notes as backup"
      ]
    }
  ]

  const features = [
    {
      icon: <Network className="w-6 h-6 text-blue-400" />,
      title: "Knowledge Graph",
      description: "Visual representation of connections between your notes",
      capabilities: [
        "Interactive node-based visualization",
        "Zoom and pan for detailed exploration",
        "Color-coded categories and topics",
        "Export options for external use"
      ]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-400" />,
      title: "Health Report",
      description: "Comprehensive analysis of your knowledge base quality",
      capabilities: [
        "Note completeness and quality scores",
        "Topic coverage analysis",
        "Orphaned notes identification",
        "Improvement recommendations"
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      title: "Enhanced Notes",
      description: "AI-improved versions of your original notes",
      capabilities: [
        "Clearer titles and summaries",
        "Extracted key concepts and tags",
        "Improved structure and formatting",
        "Cross-reference suggestions"
      ]
    }
  ]

  const faqItems = [
    {
      question: "What file formats are supported?",
      answer: "We support markdown (.md, .markdown), plain text (.txt), and most common text-based formats. Files should be packaged in a ZIP archive."
    },
    {
      question: "How long does processing take?",
      answer: "Processing time depends on the number of notes. Typically 1-10 minutes for most collections. The system prioritizes quality analysis over speed."
    },
    {
      question: "Is my data secure?",
      answer: "Your notes are processed securely and are not stored permanently. Files are automatically deleted after processing is complete."
    },
    {
      question: "Can I process the same notes multiple times?",
      answer: "Yes, you can re-process your notes as many times as needed. Each analysis may reveal new insights as our AI models improve."
    },
    {
      question: "What if processing fails?",
      answer: "If processing fails, you can restart the analysis. Common issues include corrupted files, unsupported formats, or connection problems."
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">AI Workbench Guide</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6">
            {[
              { id: 'guide', label: 'Step-by-Step Guide', icon: <Target className="w-4 h-4" /> },
              { id: 'features', label: 'Features', icon: <Zap className="w-4 h-4" /> },
              { id: 'faq', label: 'FAQ', icon: <AlertCircle className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Transform Your Notes in 4 Simple Steps</h3>
                <p className="text-gray-300">Follow this guide to get the most out of your AI Workbench experience</p>
              </div>
              
              <div className="grid gap-6">
                {guideSteps.map((step, index) => (
                  <GuideStep key={index} {...step} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Powerful Features</h3>
                <p className="text-gray-300">Discover what makes AI Workbench unique</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300 mb-4">{feature.description}</p>
                        <ul className="space-y-1">
                          {feature.capabilities.map((capability, capIndex) => (
                            <li key={capIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300">{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Frequently Asked Questions</h3>
                <p className="text-gray-300">Find answers to common questions about AI Workbench</p>
              </div>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <h4 className="text-lg font-semibold text-white mb-3">{item.question}</h4>
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkbenchGuide 