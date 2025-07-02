import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

describe('API Route: /api/waitlist', () => {
  let mockRequest: Request

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should return 200 for a valid email', async () => {
    const email = 'test@example.com'
    mockRequest = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain("Thanks for joining!")
  })

  it('should return 400 for an invalid email format', async () => {
    const email = 'invalid-email'
    mockRequest = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('A valid email is required.')
  })

  it('should return 400 if email is missing', async () => {
    mockRequest = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('A valid email is required.')
  })

  it('should return 400 if email is not a string', async () => {
    const email = 12345
    mockRequest = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('A valid email is required.')
  })

  it('should return 500 if request body is malformed JSON', async () => {
    mockRequest = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      body: '{"email": "test@example.com"', // Malformed JSON
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe('An internal server error occurred.')
  })
}) 