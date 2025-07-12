'use client'

import React, { useState } from 'react'
import { 
  BookOpen, Search, FileText, BarChart3, Users, 
  CheckCircle, AlertCircle, Target, Zap, 
  Lightbulb, ChevronRight, Brain, Network,
  Calendar, Tag, TrendingUp, Settings
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
      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">{detail}</span>
            </div>
          ))}
        </div>
        
        {tips && tips.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Research Tips</span>
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

interface ResearchGuideProps {
  onClose?: () => void
}

const ResearchGuide: React.FC<ResearchGuideProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'methods' | 'analysis'>('workflow')

  const workflowSteps = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "1. Project Organization",
      description: "Structure your research project for maximum efficiency",
      details: [
        "Create project folders with clear naming conventions",
        "Set up templates for different types of research notes",
        "Establish a consistent tagging system",
        "Define project goals and research questions"
      ],
      tips: [
        "Use date-based naming for chronological organization",
        "Create separate folders for literature, data, and analysis",
        "Maintain a master bibliography from the start"
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-green-400" />,
      title: "2. Note Management",
      description: "Capture and organize research information effectively",
      details: [
        "Take structured notes with consistent formatting",
        "Use atomic notes for single concepts",
        "Link related notes and create connection maps",
        "Regular review and synthesis of captured information"
      ],
      tips: [
        "Write notes in your own words to ensure understanding",
        "Include source citations in every note",
        "Use consistent headings and formatting"
      ]
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "3. AI-Powered Insights",
      description: "Leverage AI to discover patterns and connections",
      details: [
        "Use AI to identify themes and patterns",
        "Generate summaries of large text collections",
        "Discover connections between disparate sources",
        "Extract key concepts and terminology"
      ],
      tips: [
        "Review AI suggestions critically",
        "Use AI insights as starting points for deeper analysis",
        "Combine AI analysis with human interpretation"
      ]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-orange-400" />,
      title: "4. Analysis & Reporting",
      description: "Transform research into actionable insights",
      details: [
        "Create visual representations of findings",
        "Generate comprehensive research reports",
        "Develop evidence-based conclusions",
        "Share findings with stakeholders"
      ],
      tips: [
        "Use multiple visualization types for different insights",
        "Include methodology and limitations in reports",
        "Create executive summaries for key stakeholders"
      ]
    }
  ]

  const researchMethods = [
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: "Literature Review",
      description: "Systematic analysis of existing research",
      approaches: [
        "Comprehensive database searches",
        "Snowball sampling from key papers",
        "Citation analysis and mapping",
        "Thematic synthesis of findings"
      ]
    },
    {
      icon: <Users className="w-6 h-6 text-green-400" />,
      title: "Qualitative Research",
      description: "In-depth exploration of complex phenomena",
      approaches: [
        "Interview transcription and coding",
        "Ethnographic observation notes",
        "Focus group analysis",
        "Narrative and discourse analysis"
      ]
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      title: "Quantitative Analysis",
      description: "Statistical analysis and data interpretation",
      approaches: [
        "Survey data collection and analysis",
        "Experimental design and results",
        "Statistical modeling and testing",
        "Data visualization and reporting"
      ]
    },
    {
      icon: <Network className="w-6 h-6 text-orange-400" />,
      title: "Mixed Methods",
      description: "Combining qualitative and quantitative approaches",
      approaches: [
        "Sequential explanatory design",
        "Concurrent triangulation",
        "Embedded case studies",
        "Transformative frameworks"
      ]
    }
  ]

  const analysisTools = [
    {
      category: "Content Analysis",
      description: "Systematic examination of text and media",
      techniques: [
        "Thematic coding and categorization",
        "Frequency analysis and word clouds",
        "Sentiment analysis and emotion detection",
        "Comparative analysis across sources"
      ]
    },
    {
      category: "Pattern Recognition",
      description: "Identifying trends and relationships",
      techniques: [
        "Temporal pattern analysis",
        "Correlation and causation mapping",
        "Cluster analysis and grouping",
        "Anomaly detection and outliers"
      ]
    },
    {
      category: "Knowledge Synthesis",
      description: "Combining insights from multiple sources",
      techniques: [
        "Meta-analysis and systematic reviews",
        "Concept mapping and frameworks",
        "Theory building and validation",
        "Evidence-based recommendations"
      ]
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">Research Notes Guide</h2>
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
              { id: 'workflow', label: 'Research Workflow', icon: <Target className="w-4 h-4" /> },
              { id: 'methods', label: 'Research Methods', icon: <Zap className="w-4 h-4" /> },
              { id: 'analysis', label: 'Analysis Tools', icon: <BarChart3 className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
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
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Professional Research Workflow</h3>
                <p className="text-gray-300">Follow these steps to conduct systematic, high-quality research</p>
              </div>
              
              <div className="grid gap-6">
                {workflowSteps.map((step, index) => (
                  <GuideStep key={index} {...step} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'methods' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Research Methodologies</h3>
                <p className="text-gray-300">Choose the right approach for your research questions</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {researchMethods.map((method, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{method.title}</h4>
                        <p className="text-gray-300 mb-4">{method.description}</p>
                        <ul className="space-y-1">
                          {method.approaches.map((approach, apprIndex) => (
                            <li key={apprIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300">{approach}</span>
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

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Analysis Tools & Techniques</h3>
                <p className="text-gray-300">Transform raw data into meaningful insights</p>
              </div>
              
              <div className="space-y-6">
                {analysisTools.map((tool, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <h4 className="text-lg font-semibold text-white mb-3">{tool.category}</h4>
                    <p className="text-gray-300 mb-4">{tool.description}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {tool.techniques.map((technique, techIndex) => (
                        <div key={techIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{technique}</span>
                        </div>
                      ))}
                    </div>
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

export default ResearchGuide 