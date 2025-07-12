'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Users, MessageCircle, Download, Settings, Trash2, Edit3, Palette, Move, Zap, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import CollaborationGuide from '@/components/collaboration/CollaborationGuide';

interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  author: string;
  timestamp: number;
  tags: string[];
}

interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

const COLORS = [
  { name: 'Yellow', value: '#fef3c7', text: '#92400e' },
  { name: 'Green', value: '#dcfce7', text: '#166534' },
  { name: 'Blue', value: '#dbeafe', text: '#1e40af' },
  { name: 'Pink', value: '#fce7f3', text: '#be185d' },
  { name: 'Purple', value: '#e9d5ff', text: '#7c3aed' },
  { name: 'Orange', value: '#fed7aa', text: '#c2410c' },
];

const MOCK_USERS: User[] = [
  { id: '1', name: 'You', color: '#3b82f6', avatar: '👤' },
  { id: '2', name: 'Sarah', color: '#10b981', avatar: '👩' },
  { id: '3', name: 'Mike', color: '#f59e0b', avatar: '👨' },
];

export default function CollaborationHubPage() {
  const [notes, setNotes] = useState<StickyNote[]>([
    {
      id: '1',
      content: 'Welcome to the Collaboration Hub!\n\nThis is a demo of real-time collaborative sticky notes.',
      color: '#fef3c7',
      position: { x: 100, y: 150 },
      size: { width: 200, height: 160 },
      author: 'System',
      timestamp: Date.now(),
      tags: ['welcome'],
    },
    {
      id: '2',
      content: 'Ideas for PKM features:\n• Visual mind maps\n• AI-powered insights\n• Team collaboration',
      color: '#dcfce7',
      position: { x: 350, y: 200 },
      size: { width: 200, height: 140 },
      author: 'You',
      timestamp: Date.now() - 300000,
      tags: ['ideas', 'pkm'],
    },
    {
      id: '3',
      content: 'User feedback:\n"Love the drag-and-drop interface!"\n"Need more color options"',
      color: '#dbeafe',
      position: { x: 600, y: 180 },
      size: { width: 180, height: 120 },
      author: 'Sarah',
      timestamp: Date.now() - 600000,
      tags: ['feedback', 'ui'],
    },
  ]);

  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [users] = useState<User[]>(MOCK_USERS);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const createNote = useCallback((x: number, y: number) => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: 'New note...',
      color: '#fef3c7',
      position: { x, y },
      size: { width: 200, height: 140 },
      author: 'You',
      timestamp: Date.now(),
      tags: [],
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote.id);
    setIsCreating(false);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<StickyNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    setSelectedNote(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isCreating && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createNote(x, y);
    } else if (!draggedNote) {
      setSelectedNote(null);
    }
  }, [isCreating, createNote, draggedNote]);

  const handleMouseDown = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setDraggedNote(noteId);
    setSelectedNote(noteId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedNote && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateNote(draggedNote, { position: { x, y } });
    }
  }, [draggedNote, updateNote]);

  const handleMouseUp = useCallback(() => {
    setDraggedNote(null);
  }, []);

  const exportNotes = useCallback(() => {
    const data = {
      notes,
      users,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collaboration-session.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [notes, users]);

  const getColorByName = (colorName: string) => {
    return COLORS.find(c => c.value === colorName) || COLORS[0];
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
                <h1 className="text-xl font-bold">Collaboration Hub</h1>
                <p className="text-sm text-gray-400">Digital sticky notes workspace</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Active Users */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="flex -space-x-2">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCreating ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title="Add Note"
                >
                  <Plus className="w-5 h-5" />
                </button>
                
                <button
                  onClick={exportNotes}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Export Session"
                >
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
        </div>
      </header>

      {/* Canvas */}
      <div className="relative">
        <div
          ref={canvasRef}
          className={`relative min-h-[calc(100vh-80px)] bg-gray-900 overflow-hidden ${
            isCreating ? 'cursor-crosshair' : 'cursor-default'
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            backgroundImage: `
              linear-gradient(rgba(55, 65, 81, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Instructions */}
          {isCreating && (
            <div className="absolute top-4 left-4 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
              <Zap className="w-4 h-4 inline mr-2" />
              Click anywhere to create a new sticky note
            </div>
          )}

          {/* Sticky Notes */}
          {notes.map((note) => {
            const colorScheme = getColorByName(note.color);
            return (
              <div
                key={note.id}
                className={`absolute cursor-move select-none transition-all duration-200 ${
                  selectedNote === note.id ? 'ring-2 ring-blue-500 z-10' : 'z-0'
                } ${
                  draggedNote === note.id ? 'rotate-3 scale-105' : 'hover:rotate-1'
                }`}
                style={{
                  left: note.position.x,
                  top: note.position.y,
                  width: note.size.width,
                  height: note.size.height,
                  backgroundColor: colorScheme.value,
                  color: colorScheme.text,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                onMouseDown={(e) => handleMouseDown(e, note.id)}
              >
                <div className="h-full p-3 rounded-lg border border-black/10 flex flex-col">
                  {/* Note Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: users.find(u => u.name === note.author)?.color || '#6b7280' }}
                      />
                      <span className="text-xs font-medium">{note.author}</span>
                    </div>
                    
                    {selectedNote === note.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowColorPicker(showColorPicker === note.id ? null : note.id);
                          }}
                          className="p-1 hover:bg-black/10 rounded transition-colors"
                        >
                          <Palette className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Note Content */}
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    className="flex-1 bg-transparent border-none resize-none outline-none text-sm placeholder-current/50"
                    placeholder="Type your note here..."
                    style={{ color: colorScheme.text }}
                    onFocus={() => setSelectedNote(note.id)}
                  />

                  {/* Note Footer */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-black/10 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs opacity-70">
                      {new Date(note.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Color Picker */}
                {showColorPicker === note.id && (
                  <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl z-20">
                    <div className="grid grid-cols-3 gap-1">
                      {COLORS.map((color) => (
                        <button
                          key={color.name}
                          className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white/30 transition-colors"
                          style={{ backgroundColor: color.value }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateNote(note.id, { color: color.value });
                            setShowColorPicker(null);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Beta Notice */}
      <div className="fixed bottom-4 right-4 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-purple-300">Beta Feature</span>
        </div>
        <p className="text-xs text-gray-400">
          This is a preview of our collaborative workspace. Real-time sync coming soon!
        </p>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <CollaborationGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
} 