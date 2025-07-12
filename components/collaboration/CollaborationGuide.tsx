'use client'

import React, { useState } from 'react'
import { 
  Users, MessageCircle, Palette, Move, Eye, 
  CheckCircle, AlertCircle, Target, Zap, 
  Settings, Share2, Clock, Lightbulb,
  BookOpen, ChevronRight, FileText, Network
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

interface CollaborationGuideProps {
  onClose?: () => void
}

const CollaborationGuide: React.FC<CollaborationGuideProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'features' | 'tips'>('setup')

  const setupSteps = [
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "1. Create Your Workspace",
      description: "Set up a collaborative environment for your team",
      details: [
        "Define workspace purpose and scope",
        "Set up user roles and permissions",
        "Create initial note categories",
        "Configure privacy settings"
      ],
      tips: [
        "Keep workspace focused on specific projects",
        "Establish clear naming conventions",
        "Start with fewer categories, expand as needed"
      ]
    },
    {
      icon: <Palette className="w-6 h-6 text-green-400" />,
      title: "2. Organize with Colors",
      description: "Use color coding to categorize and prioritize content",
      details: [
        "Assign colors to different topics or priorities",
        "Create a color legend for your team",
        "Use consistent color schemes across projects",
        "Leverage visual hierarchy for quick scanning"
      ],
      tips: [
        "Limit to 5-7 colors for best usability",
        "Consider color accessibility for team members",
        "Use warm colors for urgent items"
      ]
    },
    {
      icon: <Move className="w-6 h-6 text-purple-400" />,
      title: "3. Arrange & Connect",
      description: "Spatially organize notes to show relationships",
      details: [
        "Group related notes physically together",
        "Use positioning to show workflow or hierarchy",
        "Create visual pathways between connected ideas",
        "Leave space for future additions"
      ],
      tips: [
        "Think of the workspace as a living document",
        "Use diagonal arrangements for creative thinking",
        "Keep frequently accessed notes easily visible"
      ]
    },
    {
      icon: <Share2 className="w-6 h-6 text-orange-400" />,
      title: "4. Collaborate & Iterate",
      description: "Work together in real-time and build on each other's ideas",
      details: [
        "Add comments and feedback on notes",
        "Use collaborative editing for shared content",
        "Track changes and version history",
        "Schedule regular review sessions"
      ],
      tips: [
        "Establish clear communication protocols",
        "Use @mentions for specific team members",
        "Regular saves prevent loss of work"
      ]
    }
  ]

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live editing",
      capabilities: [
        "Multiple users editing simultaneously",
        "Live cursors and user presence indicators",
        "Instant sync across all devices",
        "Conflict resolution and merge handling"
      ]
    },
    {
      icon: <Eye className="w-6 h-6 text-green-400" />,
      title: "Visual Organization",
      description: "Spatial canvas for organizing ideas",
      capabilities: [
        "Drag and drop note positioning",
        "Zoom and pan for large workspaces",
        "Grid snapping for alignment",
        "Full-screen and presentation modes"
      ]
    },
    {
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      title: "Team Management",
      description: "Control access and permissions",
      capabilities: [
        "Role-based permissions (view, edit, admin)",
        "Workspace sharing and invitations",
        "Activity logging and audit trails",
        "Integration with external tools"
      ]
    }
  ]

  const collaborationTips = [
    {
      scenario: "Brainstorming Sessions",
      description: "Maximize creative output in group sessions",
      tips: [
        "Start with individual idea generation (5 minutes)",
        "Use different colors for each participant",
        "Group similar ideas together spatially",
        "Build on others' ideas by adding connected notes",
        "Use voting or dot-voting for prioritization"
      ]
    },
    {
      scenario: "Remote Team Meetings",
      description: "Effective distributed collaboration",
      tips: [
        "Share screen with workspace for visual reference",
        "Use comments for asynchronous feedback",
        "Create meeting agenda template notes",
        "Record decisions and action items clearly",
        "Follow up with summary and next steps"
      ]
    },
    {
      scenario: "Project Planning",
      description: "Visual project management and tracking",
      tips: [
        "Create swim lanes for different work streams",
        "Use colors to indicate priority or status",
        "Link dependencies with spatial positioning",
        "Regular review and update cycles",
        "Archive completed items to reduce clutter"
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
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">Collaboration Hub Guide</h2>
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
              { id: 'setup', label: 'Setup Guide', icon: <Target className="w-4 h-4" /> },
              { id: 'features', label: 'Features', icon: <Zap className="w-4 h-4" /> },
              { id: 'tips', label: 'Best Practices', icon: <Lightbulb className="w-4 h-4" /> }
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
          {activeTab === 'setup' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Set Up Your Collaborative Workspace</h3>
                <p className="text-gray-300">Follow these steps to create an effective team workspace</p>
              </div>
              
              <div className="grid gap-6">
                {setupSteps.map((step, index) => (
                  <GuideStep key={index} {...step} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Collaboration Features</h3>
                <p className="text-gray-300">Discover tools that make teamwork seamless</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
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

          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Best Practices for Team Collaboration</h3>
                <p className="text-gray-300">Proven strategies for different collaboration scenarios</p>
              </div>
              
              <div className="space-y-6">
                {collaborationTips.map((tip, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                    <h4 className="text-lg font-semibold text-white mb-3">{tip.scenario}</h4>
                    <p className="text-gray-300 mb-4">{tip.description}</p>
                    <ul className="space-y-2">
                      {tip.tips.map((item, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
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

export default CollaborationGuide 