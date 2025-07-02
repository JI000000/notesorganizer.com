import { NextResponse } from 'next/server'
import { kv as vercelKv } from '@vercel/kv'
import { kv as kvMock } from '../../../../../lib/kv-mock'
import JSZip from 'jszip'

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

    // Check if job is completed
    if (data.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Job is not completed. Current status: ${data.status}` },
        { status: 400 }
      )
    }

    // Return the analysis results
    const response = {
      jobId: id,
      status: data.status,
      fileName: data.fileName,
      markdownCount: data.markdownCount,
      uploadTime: data.uploadTime,
      completedTime: data.completedTime,
      processingDuration: data.completedTime - data.startTime,
      results: data.results
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Results API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve results' },
      { status: 500 }
    )
  }
}

// POST endpoint for downloading the processed ZIP
export async function POST(
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

    const jobData = await kv.get(`job:${id}`)

    if (!jobData) {
      return NextResponse.json(
        { error: 'Job not found. It may have expired.' },
        { status: 404 }
      )
    }

    const data = jobData as any

    if (data.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Job is not completed. Current status: ${data.status}` },
        { status: 400 }
      )
    }

    // Generate download ZIP with processed notes
    const processedZip = await generateProcessedZip(data.results)

    // Set headers for file download
    const headers = new Headers({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="organized-${data.fileName}"`,
      'Content-Length': processedZip.length.toString()
    })

    return new Response(processedZip, { headers })

  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate download' },
      { status: 500 }
    )
  }
}

async function generateProcessedZip(results: any): Promise<Buffer> {
  const zip = new JSZip()
  
  // This is a placeholder. In the future, this will loop through
  // the actual analysis results and add them to the zip.
  if (results && results.notes) {
    for (const note of results.notes) {
      const fileName = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      zip.file(`${fileName}.md`, note.content || '')
    }
  } else {
     zip.file('placeholder.txt', 'AI analysis results would be here.')
  }

  return zip.generateAsync({ type: 'nodebuffer' })
} 