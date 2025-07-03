import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { kvMock } from '../../../../../lib/kv-mock'

const storage = process.env.NODE_ENV === 'development' ? kvMock : kv

const JOB_STATUS_PREFIX = "job:status:"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 })
  }

  try {
    const jobData = await storage.get(`${JOB_STATUS_PREFIX}${id}`)

    if (!jobData) {
      return NextResponse.json(
        { status: 'NOT_FOUND', message: 'Job not found or expired.' },
        { status: 404 }
      )
    }

    // Don't send the large zip buffer to the client
    (jobData as any).zipBuffer = undefined

    return NextResponse.json(jobData)

  } catch (error) {
    console.error(`[Status API Error] Job ${id}:`, error)
    return NextResponse.json(
      { error: 'An internal error occurred while fetching job status.' },
      { status: 500 }
    )
  }
} 