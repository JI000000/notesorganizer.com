import JSZip from 'jszip'
import { ModelRouter, TaskType, estimateTokens } from './model-router'
import { kv as vercelKv } from '@vercel/kv'
import { kv as kvMock } from '@/lib/kv-mock'

// Types for our analysis results
export interface NoteAnalysis {
  id: string
  fileName: string
  originalContent: string
  analysis: {
    title: string
    summary: string
    topics: string[]
    tags: string[]
    keyPoints: string[]
    emotionalTone: string
    readingTime: number
    complexity: 'low' | 'medium' | 'high'
  }
  suggestedLinks: Array<{
    targetNoteId: string
    reason: string
    confidence: number
  }>
  enhancedContent: string
}

export interface KnowledgeGraph {
  nodes: Array<{
    id: string
    title: string
    topics: string[]
    centrality: number
    cluster: string
  }>
  edges: Array<{
    source: string
    target: string
    weight: number
    type: 'explicit' | 'suggested' | 'semantic'
  }>
  clusters: Array<{
    id: string
    name: string
    description: string
    nodeCount: number
  }>
}

export interface HealthReport {
  overallScore: number
  insights: {
    knowledgeDistribution: {
      topTopics: Array<{ topic: string; count: number; percentage: number }>
      coverage: string
    }
    connectionHealth: {
      connectedNotes: number
      isolatedNotes: number
      averageConnections: number
      strongClusters: string[]
    }
    contentQuality: {
      averageLength: number
      readabilityScore: number
      incompleteNotes: number
    }
    growthPattern: {
      recentActivity: string
      stalenessWarning: string[]
      suggestions: string[]
    }
  }
  recommendations: Array<{
    type: 'connect' | 'expand' | 'organize' | 'cleanup'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    actionItems: string[]
  }>
}

const storage = process.env.NODE_ENV === 'development' ? kvMock : vercelKv
const MAX_TOTAL_CHARS = 150000 // 第二道防线：限制所有文件的总字符数

export class NoteAnalyzer {
  private notes: Map<string, { fileName: string; content: string }> = new Map()
  private analysisResults: Map<string, NoteAnalysis> = new Map()
  private isDevelopment = process.env.NODE_ENV === 'development'
  private modelRouter: ModelRouter

  constructor() {
    this.modelRouter = new ModelRouter()
  }

  async analyzeZip(zip: JSZip): Promise<{
    notes: NoteAnalysis[]
    knowledgeGraph: KnowledgeGraph
    healthReport: HealthReport
    stats: {
      totalNotes: number
      totalTokensProcessed: number
      estimatedCost: number
      processingTime: number
    }
  }> {
    const startTime = Date.now()
    let totalTokens = 0
    let estimatedCost = 0

    console.log('📚 Starting comprehensive note analysis...')

    // Step 1: Extract all markdown files
    await this.extractNotes(zip)
    console.log(`📄 Extracted ${this.notes.size} notes`)

    // 在开发模式下，返回模拟数据以节约成本
    if (this.isDevelopment && process.env.DISABLE_AI_IN_DEV === 'true') {
      console.log('🚧 Development mode: Using mock data to save costs')
      return this.generateMockResults()
    }

    // Step 2: Analyze each note individually
    for (const [id, note] of this.notes) {
      console.log(`🔍 Analyzing note: ${note.fileName}`)
      
      const analysis = await this.analyzeIndividualNote(id, note.fileName, note.content)
      this.analysisResults.set(id, analysis)
      
      totalTokens += estimateTokens(note.content + (analysis.enhancedContent || ''))
    }

    // Step 3: Generate link suggestions between notes
    console.log('🔗 Generating connection suggestions...')
    await this.generateLinkSuggestions()

    // Step 4: Build knowledge graph
    console.log('🕸️ Building knowledge graph...')
    const knowledgeGraph = await this.buildKnowledgeGraph()

    // Step 5: Generate health report
    console.log('📊 Generating health insights...')
    const healthReport = await this.generateHealthReport(knowledgeGraph)

    const processingTime = Date.now() - startTime
    estimatedCost = ModelRouter.estimateCost('note-analysis', totalTokens, totalTokens * 0.3)

    console.log(`✅ Analysis complete: ${this.notes.size} notes processed`)
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}`)
    console.log(`⏱️ Processing time: ${(processingTime / 1000).toFixed(1)}s`)

    return {
      notes: Array.from(this.analysisResults.values()),
      knowledgeGraph,
      healthReport,
      stats: {
        totalNotes: this.notes.size,
        totalTokensProcessed: totalTokens,
        estimatedCost,
        processingTime
      }
    }
  }

  private async extractNotes(zip: JSZip): Promise<void> {
    const promises: Promise<void>[] = []

    zip.forEach((relativePath, file) => {
      if (!file.dir && (relativePath.endsWith('.md') || relativePath.endsWith('.markdown'))) {
        promises.push(
          file.async('text').then(content => {
            const id = this.generateNoteId(relativePath)
            this.notes.set(id, {
              fileName: relativePath,
              content: content.trim()
            })
          })
        )
      }
    })

    await Promise.all(promises)
  }

  private async analyzeIndividualNote(id: string, fileName: string, content: string): Promise<NoteAnalysis> {
    // Create a comprehensive analysis prompt
    const analysisPrompt = `Analyze this markdown note and provide a comprehensive analysis in JSON format.

Note Title: ${fileName}
Content:
${content}

Please provide the following analysis in valid JSON format:
{
  "title": "Improved title based on content",
  "summary": "3-sentence summary",
  "topics": ["topic1", "topic2", "topic3"],
  "tags": ["#tag1", "#tag2", "#tag3"],
  "keyPoints": ["point1", "point2", "point3"],
  "emotionalTone": "neutral|positive|negative|mixed",
  "complexity": "low|medium|high",
  "enhancedContent": "Improved version of the note with better structure, clarity, and additional insights"
}`

    try {
      const response = await ModelRouter.executeTask(
        'note-analysis',
        [
          {
            role: 'system',
            content: 'You are an expert knowledge management analyst. Analyze notes with deep insight and provide structured, actionable analysis.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        {
          temperature: 0.3,
          maxTokens: 2000,
          contentLength: content.length
        }
      )

      let analysis
      try {
        analysis = JSON.parse(response.content || '{}')
      } catch {
        // Fallback if JSON parsing fails
        analysis = {
          title: fileName.replace(/\.md$/, ''),
          summary: 'Analysis failed - original content preserved',
          topics: [],
          tags: [],
          keyPoints: [],
          emotionalTone: 'neutral',
          complexity: 'medium',
          enhancedContent: content
        }
      }

      return {
        id,
        fileName,
        originalContent: content,
        analysis: {
          ...analysis,
          readingTime: Math.ceil(content.split(' ').length / 200) // ~200 words per minute
        },
        suggestedLinks: [], // Will be populated later
        enhancedContent: analysis.enhancedContent || content
      }

    } catch (error) {
      console.error(`Analysis failed for ${fileName}:`, error)
      
      // Return basic analysis as fallback
      return {
        id,
        fileName,
        originalContent: content,
        analysis: {
          title: fileName.replace(/\.md$/, ''),
          summary: 'Automated analysis unavailable',
          topics: [],
          tags: [],
          keyPoints: [],
          emotionalTone: 'neutral',
          readingTime: Math.ceil(content.split(' ').length / 200),
          complexity: 'medium'
        },
        suggestedLinks: [],
        enhancedContent: content
      }
    }
  }

  private async generateLinkSuggestions(): Promise<void> {
    const noteList = Array.from(this.analysisResults.values())
    
    // 为了降低成本，限制连接分析的范围
    const maxNotesToProcess = Math.min(noteList.length, 20) // 最多处理20个笔记
    const notesToProcess = noteList.slice(0, maxNotesToProcess)
    
    for (const note of notesToProcess) {
      const otherNotes = noteList.filter(n => n.id !== note.id).slice(0, 10) // 每个笔记最多与10个其他笔记比较
      
      if (otherNotes.length === 0) continue

      const linkPrompt = `Based on the following note content and a list of other available notes, suggest the top 2 most relevant connections.

Current Note: "${note.analysis.title}"
Topics: ${note.analysis.topics.join(', ')}
Summary: ${note.analysis.summary.substring(0, 200)}

Other Available Notes:
${otherNotes.slice(0, 5).map(n => `- "${n.analysis.title}" (Topics: ${n.analysis.topics.slice(0, 2).join(', ')})`).join('\n')}

Respond with ONLY valid JSON, no markdown formatting:
{
  "suggestions": [
    {
      "targetTitle": "Title of note to link to",
      "reason": "Brief reason",
      "confidence": 0.85
    }
  ]
}`

      try {
        const response = await ModelRouter.executeTask(
          'link-suggestion',
          [
            {
              role: 'system',
              content: 'You are an expert at identifying meaningful connections between knowledge items. Return only valid JSON.'
            },
            {
              role: 'user',
              content: linkPrompt
            }
          ],
          {
            temperature: 0.2,
            maxTokens: 300 // 大幅降低token限制
          }
        )

        let content = response.content || '{"suggestions":[]}'
        
        // 清理可能的markdown格式
        if (content.includes('```json')) {
          content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '')
        }
        if (content.includes('```')) {
          content = content.replace(/```\s*/g, '')
        }
        
        const suggestions = JSON.parse(content)
        
        // Map titles back to IDs and add to note
        note.suggestedLinks = (suggestions.suggestions || [])
          .map((suggestion: any) => {
            const targetNote = otherNotes.find(n => n.analysis.title === suggestion.targetTitle)
            return targetNote ? {
              targetNoteId: targetNote.id,
              reason: suggestion.reason,
              confidence: suggestion.confidence
            } : null
          })
          .filter(Boolean)
          .slice(0, 2) // 减少到最多2个连接

      } catch (error) {
        console.error(`Link suggestion failed for ${note.fileName}:`, error)
        note.suggestedLinks = [] // 失败时返回空数组，不阻断流程
      }
    }
    
    // 为剩余笔记设置空连接以避免处理
    noteList.slice(maxNotesToProcess).forEach(note => {
      note.suggestedLinks = []
    })
  }

  private async buildKnowledgeGraph(): Promise<KnowledgeGraph> {
    const notes = Array.from(this.analysisResults.values())
    
    // Create nodes
    const nodes = notes.map(note => ({
      id: note.id,
      title: note.analysis.title,
      topics: note.analysis.topics,
      centrality: note.suggestedLinks.length + notes.filter(n => n.suggestedLinks.some(l => l.targetNoteId === note.id)).length,
      cluster: note.analysis.topics[0] || 'uncategorized'
    }))

    // Create edges
    const edges: any[] = []
    
    notes.forEach(note => {
      note.suggestedLinks.forEach(link => {
        edges.push({
          source: note.id,
          target: link.targetNoteId,
          weight: link.confidence,
          type: 'suggested'
        })
      })
    })

    // Create clusters based on topics
    const topicGroups = new Map<string, string[]>()
    notes.forEach(note => {
      note.analysis.topics.forEach(topic => {
        if (!topicGroups.has(topic)) {
          topicGroups.set(topic, [])
        }
        topicGroups.get(topic)!.push(note.id)
      })
    })

    const clusters = Array.from(topicGroups.entries()).map(([topic, noteIds]) => ({
      id: topic.toLowerCase().replace(/\s+/g, '-'),
      name: topic,
      description: `Notes related to ${topic}`,
      nodeCount: noteIds.length
    }))

    return { nodes, edges, clusters }
  }

  private async generateHealthReport(knowledgeGraph: KnowledgeGraph): Promise<HealthReport> {
    const notes = Array.from(this.analysisResults.values())
    
    // Calculate health metrics
    const connectedNotes = notes.filter(n => n.suggestedLinks.length > 0).length
    const isolatedNotes = notes.length - connectedNotes
    const averageConnections = notes.reduce((sum, n) => sum + n.suggestedLinks.length, 0) / notes.length
    
    // Topic distribution
    const topicCounts = new Map<string, number>()
    notes.forEach(note => {
      note.analysis.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1)
      })
    })
    
    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({
        topic,
        count,
        percentage: (count / notes.length) * 100
      }))

    const overallScore = Math.round(
      (connectedNotes / notes.length) * 40 +
      Math.min(averageConnections / 3, 1) * 30 +
      (topTopics.length / 5) * 30
    )

    return {
      overallScore,
      insights: {
        knowledgeDistribution: {
          topTopics,
          coverage: topTopics.length > 3 ? 'diverse' : 'focused'
        },
        connectionHealth: {
          connectedNotes,
          isolatedNotes,
          averageConnections: Math.round(averageConnections * 10) / 10,
          strongClusters: knowledgeGraph.clusters.filter(c => c.nodeCount > 2).map(c => c.name)
        },
        contentQuality: {
          averageLength: Math.round(notes.reduce((sum, n) => sum + n.originalContent.length, 0) / notes.length),
          readabilityScore: 75, // Placeholder
          incompleteNotes: notes.filter(n => n.originalContent.length < 100).length
        },
        growthPattern: {
          recentActivity: 'stable',
          stalenessWarning: [],
          suggestions: [
            'Consider adding more connections between isolated notes',
            'Expand notes that are shorter than 100 characters',
            'Create index notes for major topics'
          ]
        }
      },
      recommendations: [
        {
          type: 'connect',
          title: 'Connect Isolated Notes',
          description: `${isolatedNotes} notes have no connections. Building links will improve knowledge discoverability.`,
          priority: isolatedNotes > notes.length * 0.3 ? 'high' : 'medium',
          actionItems: [
            'Review isolated notes for common themes',
            'Add cross-references to related content',
            'Create hub notes for related topics'
          ]
        }
      ]
    }
  }

  private generateMockResults() {
    const mockNotes: NoteAnalysis[] = Array.from(this.notes.entries()).map(([id, note]) => ({
      id,
      fileName: note.fileName,
      originalContent: note.content,
      analysis: {
        title: note.fileName.replace(/\.md$/, '').replace(/[-_]/g, ' '),
        summary: 'This is a mock summary generated for development testing.',
        topics: ['Development', 'Testing', 'Mock Data'],
        tags: ['#dev', '#test', '#mock'],
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        emotionalTone: 'neutral',
        readingTime: Math.ceil(note.content.split(' ').length / 200),
        complexity: 'medium' as const
      },
      suggestedLinks: [],
      enhancedContent: note.content
    }))

    const mockGraph: KnowledgeGraph = {
      nodes: mockNotes.map(note => ({
        id: note.id,
        title: note.analysis.title,
        topics: note.analysis.topics,
        centrality: Math.random() * 5,
        cluster: 'development'
      })),
      edges: [],
      clusters: [{
        id: 'development',
        name: 'Development',
        description: 'Development and testing notes',
        nodeCount: mockNotes.length
      }]
    }

    const mockHealthReport: HealthReport = {
      overallScore: 75,
      insights: {
        knowledgeDistribution: {
          topTopics: [
            { topic: 'Development', count: mockNotes.length, percentage: 100 }
          ],
          coverage: 'focused'
        },
        connectionHealth: {
          connectedNotes: 0,
          isolatedNotes: mockNotes.length,
          averageConnections: 0,
          strongClusters: []
        },
        contentQuality: {
          averageLength: mockNotes.reduce((sum, n) => sum + n.originalContent.length, 0) / mockNotes.length,
          readabilityScore: 75,
          incompleteNotes: 0
        },
        growthPattern: {
          recentActivity: 'stable',
          stalenessWarning: [],
          suggestions: ['This is mock data for development']
        }
      },
      recommendations: [{
        type: 'connect',
        title: 'Mock Recommendation',
        description: 'This is a mock recommendation for development testing.',
        priority: 'low',
        actionItems: ['Test the system', 'Verify UI', 'Check functionality']
      }]
    }

    return {
      notes: mockNotes,
      knowledgeGraph: mockGraph,
      healthReport: mockHealthReport,
      stats: {
        totalNotes: mockNotes.length,
        totalTokensProcessed: 1000,
        estimatedCost: 0.001, // 非常低的模拟成本
        processingTime: 2000
      }
    }
  }

  private generateNoteId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
  }

  private async updateProgress(
    jobId: string,
    message: string,
    progress: number,
    isError: boolean = false
  ) {
    console.log(`[Job ${jobId}] Progress: ${progress}% - ${message}`)
    const status = {
      status: isError ? 'failed' : 'processing',
      progress,
      message,
      updatedAt: new Date().toISOString(),
    }
    await storage.set(`job:${jobId}`, status, { ex: 3600 }) // 1 hour expiry
  }
} 