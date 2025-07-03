'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Download, RotateCcw, Network, FileText, BarChart3, Eye, ChevronDown, Star, TrendingUp, Users, Zap } from 'lucide-react'

interface Note {
  id: string
  analysis: {
    title: string
    summary: string
    tags: string[]
    keyPoints: string[]
    connections: string[]
  }
  originalPath: string
  content: string
}

interface KnowledgeGraph {
  nodes: Array<{
    id: string
    title: string
    type: string
    importance: number
  }>
  edges: Array<{
    source: string
    target: string
    weight: number
    type: string
  }>
}

interface HealthReport {
  overallScore: number
  insights: {
    knowledgeDistribution: {
      topTopics: Array<{ topic: string; count: number }>
      coverage: number
    }
    connectionHealth: {
      connectedNotes: number
      isolatedNotes: number
      averageConnections: number
    }
    contentQuality: {
      avgLength: number
      completeness: number
    }
  }
}

interface ResultsDashboardProps {
  fileName: string
  results: {
    notes: Note[]
    knowledgeGraph: KnowledgeGraph
    healthReport: HealthReport
    stats: {
      estimatedCost: number
      processingTime: number
    }
  }
  onDownload: () => void
  onReset: () => void
}

export default function ResultsDashboard({ results, onDownload, onReset, fileName }: ResultsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [activeTab, setActiveTab] = useState<'notes' | 'graph' | 'health'>('notes')

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let filtered = results.notes

    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.analysis.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.analysis.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(note => 
        note.analysis.tags.includes(selectedTag)
      )
    }

    return filtered
  }, [results.notes, searchQuery, selectedTag])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    results.notes.forEach(note => {
      note.analysis.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [results.notes])

  // Get top connections for knowledge graph preview
  const topConnections = useMemo(() => {
    return results.knowledgeGraph.edges
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map(edge => {
        const sourceNode = results.knowledgeGraph.nodes.find(n => n.id === edge.source)
        const targetNode = results.knowledgeGraph.nodes.find(n => n.id === edge.target)
        return {
          source: sourceNode?.title || edge.source,
          target: targetNode?.title || edge.target,
          weight: edge.weight,
          type: edge.type
        }
      })
  }, [results.knowledgeGraph])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Analysis Complete!
            </h1>
            <p className="text-xl text-gray-300">
              Results for <span className="font-semibold text-blue-300">{fileName}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onDownload}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Results
            </button>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">{results.notes.length}</span>
            </div>
            <div className="text-sm text-gray-300">Notes Processed</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Network className="w-6 h-6 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{results.knowledgeGraph.edges.length}</span>
            </div>
            <div className="text-sm text-gray-300">Connections Found</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{results.healthReport.overallScore}</span>
            </div>
            <div className="text-sm text-gray-300">Health Score</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">${results.stats.estimatedCost.toFixed(3)}</span>
            </div>
            <div className="text-sm text-gray-300">Processing Cost</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 rounded-xl p-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
              activeTab === 'notes' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Notes ({results.notes.length})
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
              activeTab === 'graph' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Network className="w-4 h-4 mr-2" />
            Knowledge Graph
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center ${
              activeTab === 'health' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Health Report
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'notes' && (
          <div>
            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedTag || ''}
                  onChange={(e) => setSelectedTag(e.target.value || null)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notes Display */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group hover:transform hover:scale-[1.02]"
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {note.analysis.title}
                    </h3>
                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {note.analysis.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.analysis.tags.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.analysis.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-lg">
                        +{note.analysis.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 truncate">
                    {note.originalPath}
                  </div>
                </div>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No notes found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-6">
            {/* Graph Visualization Placeholder */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 text-white flex items-center">
                <Network className="w-6 h-6 mr-3 text-purple-400" />
                Knowledge Graph Overview
              </h3>
              <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-600 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Interactive Graph Coming Soon</h4>
                  <p className="text-gray-400">Full interactive knowledge graph visualization will be available in the next update</p>
                </div>
              </div>
            </div>

            {/* Top Connections */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h4 className="text-lg font-semibold mb-4 text-white">Strongest Connections</h4>
              <div className="space-y-3">
                {topConnections.map((connection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-white font-medium truncate">{connection.source}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-white font-medium truncate">{connection.target}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{connection.type}</span>
                      <span className="text-sm font-medium text-purple-400">{connection.weight.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Overall Health Score</h3>
                <div className="text-4xl font-bold text-green-400">{results.healthReport.overallScore}/100</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${results.healthReport.overallScore}%` }}
                />
              </div>
            </div>

            {/* Health Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Knowledge Distribution */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3 text-blue-400" />
                  Knowledge Distribution
                </h4>
                <div className="space-y-3">
                  {results.healthReport.insights.knowledgeDistribution.topTopics.slice(0, 5).map((topic, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{topic.topic}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(topic.count / Math.max(...results.healthReport.insights.knowledgeDistribution.topTopics.map(t => t.count))) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm w-8">{topic.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Health */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <Users className="w-5 h-5 mr-3 text-purple-400" />
                  Connection Health
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Connected Notes:</span>
                    <span className="text-green-400 font-semibold">{results.healthReport.insights.connectionHealth.connectedNotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Isolated Notes:</span>
                    <span className="text-yellow-400 font-semibold">{results.healthReport.insights.connectionHealth.isolatedNotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg. Connections:</span>
                    <span className="text-blue-400 font-semibold">{results.healthReport.insights.connectionHealth.averageConnections.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note Detail Modal */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">{selectedNote.analysis.title}</h3>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 rotate-45" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Summary</h4>
                    <p className="text-gray-300">{selectedNote.analysis.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {selectedNote.analysis.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.analysis.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedNote.analysis.connections.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Connected Notes</h4>
                      <div className="space-y-2">
                        {selectedNote.analysis.connections.map((connection, index) => (
                          <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                            <span className="text-gray-300">{connection}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
