import { NextResponse } from 'next/server'

// This is a simplified mock. In a real scenario, you'd use a library 
// like zod for validation and call an AI service (OpenAI, Gemini, etc.).
const validateRequest = (body: any) => {
  if (!body.content || typeof body.content !== 'string' || body.content.length < 50) {
    return 'Content must be a string of at least 50 characters.'
  }
  return null
}

const generateMockTitles = (content: string) => {
  const firstSentence = content.split('. ')[0]
  return [
    { style: 'Click-Worthy', title: `You Won't Believe What's Inside This Note About ${firstSentence.substring(0, 20)}...` },
    { style: 'Academic', title: `An Analysis of ${firstSentence.substring(0, 30)}` },
    { style: 'SEO Optimized', title: `The Ultimate Guide to Understanding ${firstSentence.substring(0, 25)}` },
    { style: 'Intriguing Question', title: `What If You Re-examined Your Notes on ${firstSentence.substring(0, 20)}?` },
    { style: 'Simple & Direct', title: `Notes on ${firstSentence.substring(0, 40)}` },
  ]
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationError = validateRequest(body)

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const titles = generateMockTitles(body.content)

    return NextResponse.json({ titles }, { status: 200 })

  } catch (error) {
    console.error('Title generation API error:', error)
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
} 