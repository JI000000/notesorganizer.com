import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { kvMock } from '../../../../../lib/kv-mock'
import JSZip from 'jszip'

const storage = process.env.NODE_ENV === 'development' ? kvMock : kv

const JOB_STATUS_PREFIX = "job:status:"
const JOB_RESULTS_PREFIX = "job:results:"

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
    
    if (!jobData || (jobData as any).status !== 'COMPLETED') {
      return NextResponse.json(
        { status: 'PENDING', message: 'Job not found or not completed.' },
        { status: 404 }
      )
    }
    
    const results = await storage.get(`${JOB_RESULTS_PREFIX}${id}`)

    if (!results) {
        return NextResponse.json(
            { status: 'NOT_FOUND', message: 'Results not found.' },
            { status: 404 }
        )
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error(`[Results API Error] Job ${id}:`, error)
    return NextResponse.json(
      { error: 'An internal error occurred while fetching results.' },
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

    const jobData = await storage.get(`job:${id}`)

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