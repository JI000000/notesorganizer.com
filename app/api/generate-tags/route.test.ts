import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

// Mock the ModelRouter
vi.mock('@/lib/ai/model-router', () => ({
  ModelRouter: {
    executeTask: vi.fn().mockResolvedValue({
      success: true,
      content: JSON.stringify({
        tags: [
          { tag: '#productivity', confidence: 0.95, category: 'Workflow' },
          { tag: '#tools', confidence: 0.85, category: 'Technology' }
        ]
      }),
      model: 'test-model',
      usage: { prompt_tokens: 100, completion_tokens: 50 },
      estimatedCost: 0.001
    })
  }
}))

describe('/api/generate-tags', () => {
  it('should generate tags for valid input', async () => {
    const request = new Request('http://localhost/api/generate-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'This is a test content about productivity and workflow management tools.'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.tags).toBeDefined()
    expect(Array.isArray(data.tags)).toBe(true)
  })

  it('should return 400 for missing text', async () => {
    const request = new Request('http://localhost/api/generate-tags', {
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
    const request = new Request('http://localhost/api/generate-tags', {
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
    const request = new Request('http://localhost/api/generate-tags', {
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