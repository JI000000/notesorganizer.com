import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    // Lazy initialization: only create the client when it's first needed.
    // This prevents the app from crashing on startup if the key is missing but dev mode is enabled.
    openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY, // Corrected to use OPENROUTER_API_KEY
      defaultHeaders: {
        'HTTP-Referer': 'https://notesorganizer.com', // Recommended for OpenRouter
        'X-Title': 'NotesOrganizer.com', // Recommended for OpenRouter
      },
    })
  }
  return openai
}

// Model configurations with their strengths and costs
interface ModelConfig {
  name: string
  strengths: string[]
  costPer1MTokens: { input: number; output: number }
  maxTokens: number
  speed: 'fast' | 'medium' | 'slow'
}

const MODEL_CONFIGS: { [key: string]: ModelConfig } = {
  'claude-3-5-sonnet': {
    name: 'anthropic/claude-3.5-sonnet',
    strengths: ['analysis', 'reasoning', 'writing', 'complex-tasks'],
    costPer1MTokens: { input: 3, output: 15 },
    maxTokens: 200000,
    speed: 'medium'
  },
  'gpt-4o': {
    name: 'openai/gpt-4o',
    strengths: ['general', 'creative', 'structured-output'],
    costPer1MTokens: { input: 5, output: 15 },
    maxTokens: 128000,
    speed: 'fast'
  },
  'claude-3-haiku': {
    name: 'anthropic/claude-3-haiku',
    strengths: ['speed', 'simple-tasks', 'classification'],
    costPer1MTokens: { input: 0.25, output: 1.25 },
    maxTokens: 200000,
    speed: 'fast'
  },
  'gpt-3.5-turbo': {
    name: 'openai/gpt-3.5-turbo',
    strengths: ['speed', 'cost-effective', 'simple-tasks'],
    costPer1MTokens: { input: 0.5, output: 1.5 },
    maxTokens: 16000,
    speed: 'fast'
  }
}

// Task types for intelligent model selection
export type TaskType = 
  | 'note-analysis'      // Deep analysis of individual notes
  | 'topic-extraction'   // Extract topics and tags
  | 'link-suggestion'    // Suggest connections between notes
  | 'summary-generation' // Create summaries
  | 'title-generation'   // Generate catchy titles
  | 'knowledge-graph'    // Build knowledge graph
  | 'health-report'      // Generate health insights
  | 'simple-classification' // Fast classification tasks

export class ModelRouter {
  
  // Select the best model for a given task with AGGRESSIVE cost optimization
  static selectModel(taskType: TaskType, contentLength: number = 1000): string {
    switch (taskType) {
      case 'note-analysis':
        // For workbench: Use Claude 3.5 Sonnet ONLY for complex analysis
        // But limit to reasonable size chunks
        if (contentLength > 5000) {
          return MODEL_CONFIGS['gpt-4o'].name // Cheaper alternative for large content
        }
        return MODEL_CONFIGS['claude-3-5-sonnet'].name
      
      case 'knowledge-graph':
      case 'health-report':
        // Use efficient GPT-4o for graph generation (good balance of quality/cost)
        return MODEL_CONFIGS['gpt-4o'].name
        
      case 'summary-generation':
        // FREE TOOLS: Use cheapest model (Haiku)
        return MODEL_CONFIGS['claude-3-haiku'].name
        
      case 'title-generation':
        // FREE TOOLS: Use cheapest model (Haiku) - still great for titles
        return MODEL_CONFIGS['claude-3-haiku'].name
      
      case 'link-suggestion':
      case 'topic-extraction':
      case 'simple-classification':
        // Always use cheapest for these simple tasks
        return MODEL_CONFIGS['claude-3-haiku'].name
      
      default:
        // Default to cost-effective option
        return MODEL_CONFIGS['claude-3-haiku'].name
    }
  }

  // Execute an AI request with automatic model selection and STRICT token limits
  static async executeTask(
    taskType: TaskType,
    messages: any[],
    options: {
      temperature?: number
      maxTokens?: number
      contentLength?: number
      forceModel?: string
      isFreeTool?: boolean  // NEW: Flag for free tools
    } = {}
  ): Promise<{
    success: boolean
    content: string | null | undefined
    model: string
    usage: any
    estimatedCost: number
  }> {
    const {
      temperature = 0.7,
      maxTokens = 4000,
      contentLength = 1000,
      forceModel,
      isFreeTool = false
    } = options

    // AGGRESSIVE token limiting for free tools
    let adjustedMaxTokens = maxTokens
    if (isFreeTool) {
      adjustedMaxTokens = Math.min(maxTokens, 150) // Strict limit for free tools
    }

    const selectedModel = forceModel || this.selectModel(taskType, contentLength)
    
    console.log(`🤖 ModelRouter: Using ${selectedModel} for ${taskType} (free: ${isFreeTool})`)

    try {
      const client = getOpenAIClient()
      const response = await client.chat.completions.create({
        model: selectedModel,
        messages,
        temperature,
        max_tokens: adjustedMaxTokens,
      })

      const estimatedCost = this.calculateActualCost(selectedModel, response.usage)

      return {
        success: true,
        content: response.choices[0]?.message?.content,
        model: selectedModel,
        usage: response.usage,
        estimatedCost
      }

    } catch (error) {
      console.error(`❌ ModelRouter: Failed with ${selectedModel}:`, error)
      
      // Fallback to cheapest model if the primary model fails
      if (!forceModel && selectedModel !== MODEL_CONFIGS['claude-3-haiku'].name) {
        console.log('🔄 ModelRouter: Attempting fallback to Claude Haiku (cheapest)')
        return this.executeTask(taskType, messages, {
          ...options,
          forceModel: MODEL_CONFIGS['claude-3-haiku'].name
        })
      }

      throw error
    }
  }

  // Calculate actual cost from usage data
  static calculateActualCost(modelName: string, usage: any): number {
    const modelKey = Object.keys(MODEL_CONFIGS).find(key => 
      MODEL_CONFIGS[key].name === modelName
    )
    
    if (!modelKey || !usage) return 0

    const config = MODEL_CONFIGS[modelKey]
    const inputCost = (usage.prompt_tokens / 1000000) * config.costPer1MTokens.input
    const outputCost = (usage.completion_tokens / 1000000) * config.costPer1MTokens.output
    
    return inputCost + outputCost
  }

  // Get cost estimate for a task
  static estimateCost(taskType: TaskType, inputTokens: number, outputTokens: number): number {
    const modelName = Object.keys(MODEL_CONFIGS).find(key => 
      MODEL_CONFIGS[key].name === this.selectModel(taskType, inputTokens)
    )
    
    if (!modelName) return 0

    const config = MODEL_CONFIGS[modelName]
    const inputCost = (inputTokens / 1000000) * config.costPer1MTokens.input
    const outputCost = (outputTokens / 1000000) * config.costPer1MTokens.output
    
    return inputCost + outputCost
  }
}

// Utility function to count tokens (rough estimate)
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
} 