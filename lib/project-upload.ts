import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'
import { kv as vercelKv } from '@vercel/kv'
import { kv as kvMock } from '../lib/kv-mock'

const kv = process.env.NODE_ENV === 'production' ? vercelKv : kvMock

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function handleUploadLogic(file: File | null) {
  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded. Please select a ZIP file.' },
      { status: 400 }
    )
  }

  // Validate file type
  if (!file.name.toLowerCase().endsWith('.zip')) {
    return NextResponse.json(
      { error: 'Only ZIP files are supported.' },
      { status: 400 }
    )
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
      { status: 400 }
    )
  }

  // Generate unique job ID
  const jobId = uuidv4()
  
  // Convert file to buffer and validate ZIP structure
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  try {
    const zip = new JSZip()
    await zip.loadAsync(buffer)
    
    // Count markdown files
    let markdownCount = 0
    zip.forEach((relativePath, file) => {
      if (!file.dir && (relativePath.endsWith('.md') || relativePath.endsWith('.markdown'))) {
        markdownCount++
      }
    })

    if (markdownCount === 0) {
      return NextResponse.json(
        { error: 'No markdown files found in the ZIP archive.' },
        { status: 400 }
      )
    }

    // Store job metadata in KV
    const jobData = {
      status: 'PENDING',
      uploadTime: Date.now(),
      fileName: file.name,
      fileSize: file.size,
      markdownCount,
      zipData: buffer.toString('base64')
    }

    await kv.set(`job:${jobId}`, jobData, { ex: 3600 }) // Expire in 1 hour

    // Trigger async processing (non-blocking)
    processProject(jobId).catch((error: any) => {
      console.error(`Processing failed for job ${jobId}:`, error)
    })

    return NextResponse.json({
      jobId,
      markdownCount,
      message: `Successfully uploaded ${markdownCount} markdown files. Processing started.`
    })

  } catch (zipError) {
    return NextResponse.json(
      { error: 'Invalid ZIP file format.' },
      { status: 400 }
    )
  }
}

export async function processProject(jobId: string) {
  try {
    await updateJobStatus(jobId, 'PROCESSING', { startTime: Date.now() })

    // Retrieve job data
    const jobData = await kv.get(`job:${jobId}`)
    if (!jobData || typeof jobData !== 'object') {
      throw new Error('Job data not found')
    }

    const data = jobData as any
    const zipBuffer = Buffer.from(data.zipData, 'base64')
    
    // Process the ZIP file
    const zip = new JSZip()
    await zip.loadAsync(zipBuffer)
    
    const results = await analyzeNotesWithAI(zip)
    
    // Store results and update status
    await kv.set(`job:${jobId}`, {
      ...data,
      status: 'COMPLETED',
      completedTime: Date.now(),
      results,
      zipData: undefined // Remove binary data to save space
    }, { ex: 24 * 3600 }) // Keep results for 24 hours

  } catch (error: any) {
    console.error(`Processing error for job ${jobId}:`, error)
    await updateJobStatus(jobId, 'FAILED', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      failedTime: Date.now()
    })
  }
}

export async function updateJobStatus(jobId: string, status: string, additionalData: any = {}) {
  try {
    const existing = await kv.get(`job:${jobId}`)
    if (existing) {
      await kv.set(`job:${jobId}`, {
        ...existing,
        status,
        ...additionalData
      }, { ex: 24 * 3600 })
    }
  } catch (error) {
    console.error(`Failed to update status for job ${jobId}:`, error)
  }
}

export async function analyzeNotesWithAI(zip: JSZip): Promise<any> {
  // Import the analyzer dynamically to avoid issues in serverless environment
  const { NoteAnalyzer } = await import('../lib/ai/note-analyzer')
  
  const analyzer = new NoteAnalyzer()
  const results = await analyzer.analyzeZip(zip)
  
  console.log(`✅ Analysis complete: ${results.notes.length} notes processed`)
  console.log(`💰 Estimated cost: $${results.stats.estimatedCost.toFixed(4)}`)
  console.log(`⏱️ Processing time: ${(results.stats.processingTime / 1000).toFixed(1)}s`)
  
  return results
}

export async function* chunksToLines(chunksAsync: any) {
  let previous = ''
  for await (const chunk of chunksAsync) {
    let current = previous + chunk
    previous = current.slice(-1)
    if (current.endsWith('\n')) {
      yield current.slice(0, -1)
    }
  }
  if (previous.length > 0) {
    yield previous
  }
} 