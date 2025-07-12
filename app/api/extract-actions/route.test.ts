import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

// Mock the ModelRouter
vi.mock('@/lib/ai/model-router', () => ({
  ModelRouter: {
    executeTask: vi.fn().mockResolvedValue({
      success: true,
      content: JSON.stringify({
        actionItems: [
          {
            id: 1,
            task: "Test task",
            assignee: "Test User",
            priority: "High",
            deadline: "2025-01-15",
            category: "Testing",
            context: "Test context"
          }
        ],
        summary: {
          totalItems: 1,
          highPriority: 1,
          mediumPriority: 0,
          lowPriority: 0,
          categories: ["Testing"]
        }
      }),
      model: 'test-model',
      usage: { prompt_tokens: 100, completion_tokens: 50 },
      estimatedCost: 0.001
    })
  }
}))

describe('/api/extract-actions', () => {
  it('should extract action items for valid input', async () => {
    const request = new Request('http://localhost/api/extract-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Meeting notes: Sarah will follow up with the design team by Friday. Mike needs to schedule user testing sessions.'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.actionItems).toBeDefined()
    expect(Array.isArray(data.actionItems)).toBe(true)
    expect(data.summary).toBeDefined()
  })

  it('should return 400 for missing text', async () => {
    const request = new Request('http://localhost/api/extract-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 413 for text that is too long', async () => {
    const longText = 'a'.repeat(2001)
    const request = new Request('http://localhost/api/extract-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: longText })
    })

    const response = await POST(request)
    expect(response.status).toBe(413)
  })

  it('should return 400 for text that is too short', async () => {
    const request = new Request('http://localhost/api/extract-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'short' })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
}) 