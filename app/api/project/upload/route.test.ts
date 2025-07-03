import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleUploadLogic } from '../../../../lib/project-upload'
import * as route from '../../../../lib/project-upload' // Import module to spy on exported functions
import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

// Mock dependencies
vi.mock('@vercel/kv', () => ({
  kv: { set: vi.fn(), get: vi.fn() },
}))
vi.mock('../../../../lib/kv-mock', () => ({
  kv: { set: vi.fn(), get: vi.fn() },
}))

vi.mock('uuid', () => ({
  v4: vi.fn(),
}))

// Mock note-analyzer to prevent actual AI calls in tests
vi.mock('../../../../lib/ai/note-analyzer', () => ({
  NoteAnalyzer: vi.fn().mockImplementation(() => ({
    analyzeZip: vi.fn().mockResolvedValue({
      stats: { estimatedCost: 0.123, processingTime: 1000 },
      notes: [{ id: 'note1' }],
    }),
  })),
}))

describe('API Route Logic: handleUploadLogic', () => {
  const mockUuidV4 = uuidv4 as ReturnType<typeof vi.fn>
  let processProjectSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    processProjectSpy = vi.spyOn(route, 'processProject').mockImplementation(async () => {})
  })

  // Helper to create a mock file object with a functioning arrayBuffer method
  const createMockFile = async (name: string, content: string | Buffer, type: string) => {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
    const file = new File([buffer], name, { type })
    
    // Manually add the arrayBuffer method for the test environment
    Object.defineProperty(file, 'arrayBuffer', {
      value: () => Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)),
      writable: true,
      configurable: true,
    })

    return file
  }

  it('should process a valid zip, create a job, and start processing', async () => {
    // Dynamically import the mock to get a reference to it *after* hoisting
    const { kv: kvMock } = await import('../../../../lib/kv-mock')
    const mockKvSet = kvMock.set as ReturnType<typeof vi.fn>
    
    const mockJobId = 'test-job-id-123'
    mockUuidV4.mockReturnValue(mockJobId)

    const zip = new JSZip()
    // Use longer content to ensure it passes our validation checks
    zip.file('note1.md', '# Test Note\n\nThis is a test note with enough content to pass validation checks. It contains multiple paragraphs and sufficient length to be processed by our AI system.\n\n## Section 1\n\nSome content here with meaningful text that should be long enough to meet our minimum requirements for processing.\n\n## Section 2\n\nMore content to ensure we have sufficient material for analysis.')
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    const mockFile = await createMockFile('test.zip', zipBuffer, 'application/zip')

    const response = await handleUploadLogic(mockFile)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.jobId).toBe(mockJobId)
    expect(data.markdownCount).toBe(1)
    expect(data.totalContentSize).toBeGreaterThanOrEqual(0)
    expect(data.estimatedProcessingTime).toBeGreaterThan(0)
    expect(data.message).toContain('Successfully uploaded')
    
    expect(mockKvSet).toHaveBeenCalledOnce()
    
    // Verify that the KV store was called with the correct job data structure
    const kvSetCall = mockKvSet.mock.calls[0]
    expect(kvSetCall[0]).toBe(`job:${mockJobId}`)
    expect(kvSetCall[1]).toMatchObject({
      status: 'PENDING',
      fileName: 'test.zip',
      markdownCount: 1,
      totalContentLength: expect.any(Number),
      estimatedTokens: expect.any(Number),
      estimatedCost: expect.any(Number),
      zipData: expect.any(String)
    })
  })

  it('should not call kv.set when zip file contains no markdown files', async () => {
    const { kv: kvMock } = await import('../../../../lib/kv-mock')
    const mockKvSet = kvMock.set as ReturnType<typeof vi.fn>

    const zip = new JSZip()
    zip.file('image.jpg', 'not text')
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    const mockFile = await createMockFile('test.zip', zipBuffer, 'application/zip')

    const response = await handleUploadLogic(mockFile)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('No markdown files found in the ZIP archive.')
    expect(mockKvSet).not.toHaveBeenCalled()
  })
  
  it('should return 400 for a non-zip file', async () => {
    const mockFile = await createMockFile('test.txt', 'this is plain text', 'text/plain')
    
    const response = await handleUploadLogic(mockFile)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Only ZIP files are supported.')
  })

  it('should return 400 for a file that is too large', async () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024)
    const mockFile = await createMockFile('large.zip', largeBuffer, 'application/zip')

    const response = await handleUploadLogic(mockFile)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('File too large. Maximum size is 5MB.')
  })

  it('should return 400 for a corrupted zip file', async () => {
    const mockFile = await createMockFile('corrupted.zip', 'this is not a zip', 'application/zip')
    
    const response = await handleUploadLogic(mockFile)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid ZIP file format.')
  })
}) 