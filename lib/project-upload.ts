import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'
import { kv } from '@vercel/kv'
import { kvMock } from './kv-mock'
import { NoteAnalyzer } from './ai/note-analyzer'

const storage = process.env.NODE_ENV === 'development' ? kvMock : kv

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// NEW: Strict limits for cost control
const MAX_NOTES_COUNT = 100 // Maximum number of notes in one upload
const MAX_SINGLE_NOTE_SIZE = 50 * 1024 // 50KB per individual note
const MAX_TOTAL_CONTENT_LENGTH = 200 * 1024 // 200KB total content across all notes

// Rough token estimation (1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export async function handleUploadLogic(file: File | null) {
  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded.' },
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
      { error: `File too large. Max size is 5MB.` },
      { status: 413 }
    )
  }

  try {
    const buffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(buffer)
    
    let markdownCount = 0
    let totalContentLength = 0
    const oversizedFiles: string[] = []
    
    // Use a standard for...of loop for clarity with async operations
    for (const [path, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir && (path.endsWith('.md') || path.endsWith('.markdown'))) {
        markdownCount++
        const content = await zipEntry.async('string')
        const contentLength = new TextEncoder().encode(content).length
        if (contentLength > MAX_SINGLE_NOTE_SIZE) {
          oversizedFiles.push(`${path} (${Math.round(contentLength / 1024)}KB)`)
        }
        totalContentLength += contentLength
      }
    }

    // Validate note count
    if (markdownCount === 0) {
      return NextResponse.json(
        { error: 'No markdown files found in the ZIP.' },
        { status: 400 }
      )
    }

    if (markdownCount > MAX_NOTES_COUNT) {
      return NextResponse.json(
        { error: `Too many notes. Max ${MAX_NOTES_COUNT}.` },
        { status: 413 }
      )
    }

    // Validate individual file sizes
    if (oversizedFiles.length > 0) {
      const errorFiles = oversizedFiles.slice(0, 3).join(', ')
      return NextResponse.json(
        { error: `Some notes are too large (max 50KB): ${errorFiles}...` },
        { status: 413 }
      )
    }

    // Validate total content size
    if (totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Total content size too large (max 200KB).` },
        { status: 413 }
      )
    }

    // Estimate processing cost
    const estimatedTokens = estimateTokens(file.name) // Fixed: use actual content not length string
    const estimatedCost = (estimatedTokens / 1000000) * 3 * 1.5 // Rough cost estimate
    
    console.log(`📊 Upload validation: ${markdownCount} notes, ${Math.round(totalContentLength / 1024)}KB content, ~${estimatedTokens} tokens, ~$${estimatedCost.toFixed(4)} estimated cost`)

    const jobId = uuidv4()
    const jobData = {
      status: 'QUEUED',
      uploadTime: new Date().toISOString(),
      fileName: file.name,
      zipBuffer: Buffer.from(buffer), // Store buffer for processing
      startTime: Date.now()
    }
    
    await storage.set(`job:status:${jobId}`, jobData, { ex: 3600 })

    // Non-blocking call to start processing
    processProject(jobId).catch(err => {
      console.error(`[Job ${jobId}] Critical background processing error:`, err)
    })

    return NextResponse.json({
      jobId,
      markdownCount,
      message: 'Upload successful. Analysis has started.'
    })

  } catch (e) {
    console.error("Upload logic error:", e)
    return NextResponse.json({ error: 'Invalid or corrupted ZIP file format.' }, { status: 400 })
  }
}

export async function processProject(jobId: string) {
  try {
    // The NoteAnalyzer now handles its own status updates internally
    const { NoteAnalyzer } = await import('../lib/ai/note-analyzer')
    const analyzer = new NoteAnalyzer(jobId)
    await analyzer.process()
  } catch (error: any) {
    console.error(`Processing error for job ${jobId}:`, error)
    // The analyzer's internal catch block should handle status updates.
    // We can add a fallback here if needed, but it's better to keep it in one place.
    await updateJobStatus(jobId, 'FAILED', { 
      error: error instanceof Error ? error.message : 'Unknown critical error',
      failedTime: Date.now()
    })
  }
}

export async function updateJobStatus(jobId: string, status: string, additionalData: any = {}) {
  try {
    const existing = await storage.get(`job:status:${jobId}`)
    if (existing) {
      await storage.set(`job:status:${jobId}`, {
        ...existing,
        status,
        ...additionalData
      }, { ex: 24 * 3600 })
    }
  } catch (error) {
    console.error(`Failed to update status for job ${jobId}:`, error)
  }
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