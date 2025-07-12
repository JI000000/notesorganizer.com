'use client';

import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Filter, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

// Custom node component
const CustomNode = ({ data, selected }: any) => {
  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-slate-800 text-white shadow-lg transition-all duration-200 ${
        selected 
          ? 'border-blue-500 shadow-blue-500/50' 
          : 'border-slate-600 hover:border-slate-500'
      }`}
      style={{ minWidth: '150px' }}
    >
      <div className="font-semibold text-sm mb-1">{data.title}</div>
      <div className="text-xs text-gray-400">{data.category}</div>
      {data.tags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.tags.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {data.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 rounded-full text-xs">
              +{data.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface KnowledgeGraphProps {
  data?: {
    notes: any[];
    connections: any[];
    stats: any;
  };
  isLoading?: boolean;
  onNodeClick?: (node: Node) => void;
  onExport?: () => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  data,
  isLoading = false,
  onNodeClick,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Convert data to ReactFlow format
  const initialNodes: Node[] = useMemo(() => {
    if (!data?.notes) return [];
    
    return data.notes.map((note, index) => ({
      id: note.id || index.toString(),
      type: 'custom',
      position: { 
        x: Math.random() * 800, 
        y: Math.random() * 600 
      },
      data: {
        title: note.title || `Note ${index + 1}`,
        category: note.category || 'General',
        tags: note.tags || [],
        content: note.content || '',
      },
    }));
  }, [data?.notes]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!data?.connections) return [];
    
    return data.connections.map((connection, index) => ({
      id: `e${index}`,
      source: connection.source,
      target: connection.target,
      animated: true,
      style: {
        stroke: '#60a5fa',
        strokeWidth: 2,
      },
      label: connection.relationship || '',
      labelStyle: {
        fontSize: '10px',
        fill: '#9ca3af',
      },
    }));
  }, [data?.connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Filter nodes based on search and category
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = !searchTerm || 
        node.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.data.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        node.data.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(nodes.map(node => node.data.category));
    return Array.from(cats);
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Building knowledge graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/50 rounded-xl border border-slate-700/50 ${isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-96'}`}>
      <ReactFlowProvider>
        <div className="relative w-full h-full">
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onExport}
                className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                title="Export Graph"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-slate-800/80 border border-slate-600 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ReactFlow */}
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
            }}
            style={{
              background: 'transparent',
            }}
          >
            <Controls className="!bg-slate-800/80 !border-slate-600 ![&_button]:!bg-slate-700/80 ![&_button]:!border-slate-600 ![&_button]:!text-gray-300" />
            <MiniMap
              className="!bg-slate-800/80 !border-slate-600"
              nodeColor={(node) => {
                switch (node.data.category) {
                  case 'Ideas': return '#3b82f6';
                  case 'Research': return '#10b981';
                  case 'Tasks': return '#f59e0b';
                  default: return '#6b7280';
                }
              }}
            />
            <Background color="#374151" gap={16} />
            
            {/* Stats Panel */}
            <Panel position="bottom-left" className="bg-slate-800/80 border border-slate-600 rounded-lg p-4 m-4">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{filteredNodes.length} Notes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{edges.length} Connections</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{categories.length} Categories</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default KnowledgeGraph; 