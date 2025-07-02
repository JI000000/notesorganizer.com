import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { kv as kvMock } from '../../../../../lib/kv-mock'

vi.mock('../../../../../lib/kv-mock', () => ({
  kv: {
    get: vi.fn(),
  },
}))

// This mock is needed because route.ts imports it, even if unused in 'test' env.
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
  },
}))

const mockKvGet = kvMock.get as ReturnType<typeof vi.fn>

describe('API Route: /api/project/[id]/status', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should return job status for a valid job ID', async () => {
    const mockJobData = {
      status: 'PROCESSING',
      fileName: 'test.zip',
      fileSize: 12345,
      markdownCount: 10,
      uploadTime: Date.now(),
      startTime: Date.now(),
    }
    mockKvGet.mockResolvedValue(mockJobData)

    const request = new Request('http://localhost/api/project/test-job-id/status')
    const context = { params: { id: 'test-job-id' } }

    const response = await GET(request, context)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockKvGet).toHaveBeenCalledWith('job:test-job-id')
    expect(data.jobId).toBe('test-job-id')
    expect(data.status).toBe('PROCESSING')
    expect(data.progress.stage).toBe('AI is analyzing your notes')
  })

  it('should return 404 if job ID is not found', async () => {
    mockKvGet.mockResolvedValue(null) // Simulate job not found

    const request = new Request('http://localhost/api/project/not-found-id/status')
    const context = { params: { id: 'not-found-id' } }

    const response = await GET(request, context)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Job not found. It may have expired.')
  })

  it('should return 400 if job ID is missing', async () => {
    const request = new Request('http://localhost/api/project//status')
    const context = { params: { id: '' } } // Simulate missing ID

    const response = await GET(request, context)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid job ID')
    expect(mockKvGet).not.toHaveBeenCalled()
  })

  it('should return 500 if kv.get fails', async () => {
    mockKvGet.mockRejectedValue(new Error('KV store unavailable'))

    const request = new Request('http://localhost/api/project/failing-id/status')
    const context = { params: { id: 'failing-id' } }

    const response = await GET(request, context)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to retrieve job status')
  })
}) 