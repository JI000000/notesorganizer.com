import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { POST } from './route'
import { ModelRouter } from '@/lib/ai/model-router'

// Mock the static method of ModelRouter
vi.mock('@/lib/ai/model-router', () => {
  return {
    ModelRouter: {
      executeTask: vi.fn(),
    },
    // We also need to provide the real TaskType if it's used elsewhere, 
    // but since we use string literals now, it's not strictly necessary.
    // However, it's good practice for a complete mock.
    TaskType: {},
  }
})

// Type assertion for the mocked static method
const mockedExecuteTask = ModelRouter.executeTask as ReturnType<typeof vi.fn>

describe('API Route: /api/generate-title', () => {
  let mockRequest: Request

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should return a list of titles for a valid request', async () => {
    const mockTitles = '1. Title 1\n2. Title 2'
    mockedExecuteTask.mockResolvedValue({ 
      success: true, 
      content: mockTitles,
      estimatedCost: 0.001
    })

    mockRequest = new Request('http://localhost/api/generate-title', {
      method: 'POST',
      body: JSON.stringify({ text: 'This is a valid piece of text that is long enough for title generation.' }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.titles).toEqual(['Title 1', 'Title 2'])
    expect(mockedExecuteTask).toHaveBeenCalledOnce()
    expect(mockedExecuteTask).toHaveBeenCalledWith('title-generation', expect.any(Array), expect.any(Object))
  })

  it('should return 413 if text is too long', async () => {
    const longText = 'a'.repeat(2001)
    mockRequest = new Request('http://localhost/api/generate-title', {
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
    mockRequest = new Request('http://localhost/api/generate-title', {
      method: 'POST',
      body: JSON.stringify({ text: 'short' }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Input text is too short. Minimum is 50 characters.')
    expect(mockedExecuteTask).not.toHaveBeenCalled()
  })

  it('should return 400 if text is missing', async () => {
    mockRequest = new Request('http://localhost/api/generate-title', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Input text is missing or invalid.')
    expect(mockedExecuteTask).not.toHaveBeenCalled()
  })

  it('should return 500 if the AI model fails', async () => {
    const errorMessage = 'AI model processing failed'
    mockedExecuteTask.mockRejectedValue(new Error(errorMessage))

    mockRequest = new Request('http://localhost/api/generate-title', {
      method: 'POST',
      body: JSON.stringify({ text: 'A valid text that will cause a model failure because it is long enough.' }),
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
      mockRequest = new Request('http://localhost/api/generate-title', {
        method: 'POST',
        body: JSON.stringify({ text: 'This is some text that is long enough for title generation purposes.' }),
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.titles).toBeInstanceOf(Array)
      expect(data.titles.length).toBe(5)
      expect(mockedExecuteTask).not.toHaveBeenCalled()
    })
  })
}) 