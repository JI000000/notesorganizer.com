import { NextResponse } from 'next/server'
import { kv as vercelKv } from '@vercel/kv'
import { kv as kvMock } from '../../../../../lib/kv-mock'

const kv = process.env.NODE_ENV === 'production' ? vercelKv : kvMock

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    // Retrieve job data from KV
    const jobData = await kv.get(`job:${id}`)

    if (!jobData) {
      return NextResponse.json(
        { error: 'Job not found. It may have expired.' },
        { status: 404 }
      )
    }

    const data = jobData as any

    // Return status and relevant metadata
    const response = {
      jobId: id,
      status: data.status,
      fileName: data.fileName,
      fileSize: data.fileSize,
      markdownCount: data.markdownCount,
      uploadTime: data.uploadTime,
      startTime: data.startTime,
      completedTime: data.completedTime,
      failedTime: data.failedTime,
      error: data.error,
      // Calculate progress indicators
      progress: calculateProgress(data.status, data.startTime, data.completedTime)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve job status' },
      { status: 500 }
    )
  }
}

function calculateProgress(status: string, startTime?: number, completedTime?: number) {
  switch (status) {
    case 'PENDING':
      return { percentage: 5, stage: 'Queued for processing', message: 'Your knowledge awaits transformation...' }
    case 'PROCESSING':
      if (startTime) {
        const elapsed = Date.now() - startTime
        const estimatedDuration = 120000 // 2 minutes estimated
        const percentage = Math.min(95, 20 + (elapsed / estimatedDuration) * 70)
        return { 
          percentage: Math.round(percentage), 
          stage: 'AI is analyzing your notes', 
          message: 'Discovering patterns and connections...'
        }
      }
      return { percentage: 20, stage: 'Processing started', message: 'AI awakening...' }
    case 'COMPLETED':
      return { percentage: 100, stage: 'Analysis complete', message: 'Your knowledge garden is ready!' }
    case 'FAILED':
      return { percentage: 0, stage: 'Processing failed', message: 'Something went wrong. Please try again.' }
    default:
      return { percentage: 0, stage: 'Unknown', message: 'Status unknown' }
  }
} 