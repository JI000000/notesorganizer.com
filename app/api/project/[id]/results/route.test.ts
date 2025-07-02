import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { kv as kvMock } from '../../../../../lib/kv-mock'

vi.mock('../../../../../lib/kv-mock', () => ({
  kv: {
    get: vi.fn(),
  },
}))

vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
  },
}))

const mockKvGet = kvMock.get as ReturnType<typeof vi.fn>

describe('API Route: /api/project/[id]/results', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // --- Test GET Endpoint ---
  describe('GET', () => {
    it('should return job results for a completed job', async () => {
      const mockJobData = {
        status: 'COMPLETED',
        results: { summary: 'Test summary' },
        fileName: 'test.zip'
      }
      mockKvGet.mockResolvedValue(mockJobData)

      const request = new Request('http://localhost/api/project/test-job-id/results')
      const context = { params: { id: 'test-job-id' } }

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockKvGet).toHaveBeenCalledWith('job:test-job-id')
      expect(data.results.summary).toBe('Test summary')
    })

    it('should return 400 if job is not completed', async () => {
      mockKvGet.mockResolvedValue({ status: 'PROCESSING' })

      const request = new Request('http://localhost/api/project/processing-job/results')
      const context = { params: { id: 'processing-job' } }
      
      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Job is not completed. Current status: PROCESSING')
    })

    it('should return 404 if job is not found', async () => {
      mockKvGet.mockResolvedValue(null)
      
      const request = new Request('http://localhost/api/project/not-found/results')
      const context = { params: { id: 'not-found' } }

      const response = await GET(request, context)
      const data = await response.json()
      
      expect(response.status).toBe(404)
    })
  })

  // --- Test POST Endpoint (Download) ---
  describe('POST', () => {
    it('should return a zip file for a completed job', async () => {
      const mockJobData = {
        status: 'COMPLETED',
        fileName: 'my-notes.zip',
        results: { notes: [] }
      }
      mockKvGet.mockResolvedValue(mockJobData)

      const request = new Request('http://localhost/api/project/test-job-id/results', { method: 'POST' })
      const context = { params: { id: 'test-job-id' } }

      const response = await POST(request, context)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/zip')
      expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="organized-my-notes.zip"')
    })

    it('should return 400 if job is not completed', async () => {
      mockKvGet.mockResolvedValue({ status: 'FAILED' })

      const request = new Request('http://localhost/api/project/failed-job/results', { method: 'POST' })
      const context = { params: { id: 'failed-job' } }

      const response = await POST(request, context)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toContain('Job is not completed')
    })
  })
}) 