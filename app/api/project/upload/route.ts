import { NextResponse } from 'next/server'
import { handleUploadLogic } from '../../../../lib/project-upload'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('zipFile') as File
    
    return await handleUploadLogic(file)

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload. Please try again.' },
      { status: 500 }
    )
  }
} 