import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { POST } from './route'
import { ModelRouter } from '@/lib/ai/model-router'

vi.mock('@/lib/ai/model-router', () => ({
  ModelRouter: {
    executeTask: vi.fn(),
  },
}))

const mockedExecuteTask = ModelRouter.executeTask as ReturnType<typeof vi.fn>

describe('API Route: /api/summarize', () => {
  let mockRequest: Request

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should return a summary for a valid request', async () => {
    const mockSummary = 'This is a mock summary.'
    mockedExecuteTask.mockResolvedValue({ success: true, content: mockSummary })

    mockRequest = new Request('http://localhost/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ text: 'This is a valid piece of text that is long enough for summarization.' }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.summary).toEqual(mockSummary)
    expect(mockedExecuteTask).toHaveBeenCalledOnce()
    expect(mockedExecuteTask).toHaveBeenCalledWith('summary-generation', expect.any(Array), expect.any(Object))
  })

  it('should return 413 if text is too long', async () => {
    const longText = 'a'.repeat(2001)
    mockRequest = new Request('http://localhost/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ text: longText }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(413)
    expect(data.error).toBe('Input text is too long. Maximum is 2000 characters.')
    expect(mockedExecuteTask).not.toHaveBeenCalled()
  })

  it('should return 400 if text is too short', async () => {
    mockRequest = new Request('http://localhost/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ text: 'short' }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Input text is too short. Minimum is 50 characters.')
    expect(mockedExecuteTask).not.toHaveBeenCalled()
  })
  
  it('should return 500 if the AI model fails', async () => {
    const errorMessage = 'AI model for summarization failed'
    mockedExecuteTask.mockRejectedValue(new Error(errorMessage))

    mockRequest = new Request('http://localhost/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ text: 'A valid text that is long enough but will cause a model failure.' }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe(errorMessage)
    expect(mockedExecuteTask).toHaveBeenCalledOnce()
  })

  describe('in development with DISABLE_AI_IN_DEV', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      process.env = { ...OLD_ENV, NODE_ENV: 'development', DISABLE_AI_IN_DEV: 'true' }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    it('should return mock data', async () => {
      mockRequest = new Request('http://localhost/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ text: 'any text' }),
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(typeof data.summary).toBe('string')
      expect(data.summary).toContain('mock summary')
      expect(mockedExecuteTask).not.toHaveBeenCalled()
    })
  })
}) 