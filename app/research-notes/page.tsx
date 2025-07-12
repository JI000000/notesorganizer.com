'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Plus, Search, Filter, BookOpen, FileText, Tag, Calendar, 
  Users, Star, TrendingUp, Link2, MessageCircle, Download, 
  Settings, ArrowLeft, ChevronRight, Lightbulb, Target,
  Brain, Zap, Network, BarChart3, Clock, CheckCircle, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import ResearchGuide from '@/components/research/ResearchGuide';

interface ResearchProject {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  lastModified: number;
  notesCount: number;
  collaborators: string[];
  tags: string[];
  color: string;
}

interface ResearchNote {
  id: string;
  title: string;
  content: string;
  projectId: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  author: string;
  references: string[];
  insights: string[];
  connections: string[];
}

interface Insight {
  id: string;
  type: 'trend' | 'connection' | 'gap' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  relatedNotes: string[];
}

const MOCK_PROJECTS: ResearchProject[] = [
  {
    id: '1',
    name: 'PKM Market Analysis',
    description: 'Comprehensive analysis of the Personal Knowledge Management market',
    category: 'Market Research',
    status: 'active',
    lastModified: Date.now() - 3600000,
    notesCount: 24,
    collaborators: ['You', 'Sarah', 'Mike'],
    tags: ['market-research', 'pkm', 'competitive-analysis'],
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'AI Integration Patterns',
    description: 'Research on effective AI integration in knowledge management tools',
    category: 'Technical Research',
    status: 'active',
    lastModified: Date.now() - 7200000,
    notesCount: 18,
    collaborators: ['You', 'Alex'],
    tags: ['ai', 'integration', 'patterns'],
    color: '#10b981',
  },
  {
    id: '3',
    name: 'User Experience Study',
    description: 'UX research for note-taking applications',
    category: 'UX Research',
    status: 'completed',
    lastModified: Date.now() - 86400000,
    notesCount: 31,
    collaborators: ['You', 'Sarah'],
    tags: ['ux', 'user-research', 'usability'],
    color: '#f59e0b',
  },
];

const MOCK_NOTES: ResearchNote[] = [
  {
    id: '1',
    title: 'Market Size Analysis',
    content: '# Market Size Analysis\n\n## Key Findings\n\n- Global PKM market estimated at $2.8B in 2024\n- Growing at 12.5% CAGR\n- Key drivers: remote work, information overload\n\n## Market Segments\n\n### Individual Users\n- Students and researchers\n- Knowledge workers\n- Creative professionals\n\n### Enterprise\n- Large corporations\n- Consulting firms\n- Research institutions\n\n## Competitive Landscape\n\n- **Notion**: $10B valuation, 30M users\n- **Obsidian**: 1M+ users, premium model\n- **Roam Research**: $200M valuation, niche market\n\n## Opportunities\n\n1. Better AI integration\n2. Visual knowledge mapping\n3. Collaborative features\n4. Mobile-first design',
    projectId: '1',
    category: 'Analysis',
    tags: ['market-size', 'competitive-analysis', 'opportunities'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    author: 'You',
    references: ['Market Research Report 2024', 'Crunchbase Data'],
    insights: ['Market growing faster than expected', 'AI integration gap in current tools'],
    connections: ['User Interview Insights', 'Technology Trends'],
  },
  {
    id: '2',
    title: 'AI Integration Patterns',
    content: '# AI Integration Patterns in PKM\n\n## Common Approaches\n\n### 1. Auto-tagging\n- Automatically extract tags from content\n- Success rate: 70-85%\n- User satisfaction: High\n\n### 2. Content Summarization\n- Generate summaries of long documents\n- Reduces reading time by 60%\n- Accuracy varies by content type\n\n### 3. Connection Discovery\n- Find related notes and concepts\n- Improves knowledge discovery\n- Requires high-quality embeddings\n\n## Best Practices\n\n1. **Progressive Enhancement**\n   - Start with basic features\n   - Add AI gradually\n   - Maintain user control\n\n2. **Transparency**\n   - Show AI confidence scores\n   - Allow manual overrides\n   - Explain reasoning\n\n3. **Privacy**\n   - Local processing when possible\n   - Encrypted data transmission\n   - Clear privacy policies\n\n## Implementation Challenges\n\n- Model selection and fine-tuning\n- Cost optimization\n- Performance requirements\n- User trust and adoption',
    projectId: '2',
    category: 'Technical',
    tags: ['ai', 'integration', 'patterns', 'best-practices'],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000,
    author: 'You',
    references: ['AI Integration Study', 'User Feedback Report'],
    insights: ['Progressive enhancement works best', 'Privacy is key concern'],
    connections: ['User Privacy Concerns', 'Technology Implementation'],
  },
];

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Rising Demand for Visual Knowledge Maps',
    description: 'Multiple data points indicate users prefer visual representation of knowledge connections',
    confidence: 85,
    relatedNotes: ['1', '2'],
  },
  {
    id: '2',
    type: 'gap',
    title: 'Mobile Experience Gap',
    description: 'Current PKM tools lack effective mobile interfaces for knowledge capture',
    confidence: 78,
    relatedNotes: ['1'],
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'AI-Powered Research Assistant',
    description: 'Opportunity to create AI assistant specifically for research workflows',
    confidence: 92,
    relatedNotes: ['2'],
  },
];

export default function ResearchNotesPage() {
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [selectedNote, setSelectedNote] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showInsights, setShowInsights] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const currentProject = useMemo(() => 
    MOCK_PROJECTS.find(p => p.id === selectedProject), 
    [selectedProject]
  );

  const currentNote = useMemo(() => 
    MOCK_NOTES.find(n => n.id === selectedNote), 
    [selectedNote]
  );

  const filteredNotes = useMemo(() => {
    return MOCK_NOTES.filter(note => 
      note.projectId === selectedProject &&
      (searchQuery === '' || 
       note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [selectedProject, searchQuery]);

  const handleNoteSelect = useCallback((noteId: string) => {
    const note = MOCK_NOTES.find(n => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setNoteContent(note.content);
      setIsEditing(false);
    }
  }, []);

  const handleSaveNote = useCallback(() => {
    // In a real app, this would save to backend
    console.log('Saving note:', noteContent);
    setIsEditing(false);
  }, [noteContent]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'gap': return Target;
      case 'opportunity': return Lightbulb;
      default: return Brain;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-none px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Research Notes</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentProject?.name}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>{currentNote?.title}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className={`p-2 rounded-lg transition-colors ${
                  showInsights ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Brain className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowGuide(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                title="How to Use"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Left Sidebar - Projects */}
        <div className="w-80 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Research Projects</h2>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {MOCK_PROJECTS.map(project => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedProject === project.id
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{project.notesCount} notes</span>
                    <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Notes List */}
        <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedNote === note.id
                      ? 'border-green-500 bg-green-600/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                  onClick={() => handleNoteSelect(note.id)}
                >
                  <h3 className="font-semibold text-white mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{note.author}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Note Editor */}
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              {currentNote && (
                <>
                  <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{currentNote.title}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isEditing 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isEditing ? 'Save' : 'Edit'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    {isEditing ? (
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full h-full bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-blue-500"
                        placeholder="Start writing your research notes..."
                      />
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {currentNote.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Sidebar - Insights */}
            {showInsights && (
              <div className="w-80 bg-slate-800/50 border-l border-slate-700/50 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Insights
                </h3>
                
                <div className="space-y-4">
                  {MOCK_INSIGHTS.map(insight => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <div
                        key={insight.id}
                        className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-purple-300 capitalize">{insight.type}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {insight.confidence}% confident
                          </span>
                        </div>
                        <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Link2 className="w-3 h-3" />
                          <span>{insight.relatedNotes.length} related notes</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">Research Assistant</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    AI-powered research assistant to help with analysis and insights.
                  </p>
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm">
                    Chat with Assistant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <ResearchGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
} 