import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Reuse the same OpenRouter-configured OpenAI client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://notesorganizer.com',
    'X-Title': 'NotesOrganizer.com',
  },
})

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Service not configured.' },
      { status: 500 }
    )
  }

  try {
    const { text } = await request.json()
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "You are a world-class expert in copywriting and content strategy. Your task is to generate exactly 5 compelling titles for a given piece of text. Please provide them in a numbered list format (1. Title one, 2. Title two, etc.), with each title on a new line. Do not add any extra text or commentary.",
        },
        {
          role: 'user',
          content: `Please generate 5 titles for the following text:\n\n${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const rawTitles = response.choices[0]?.message?.content?.trim()
    if (!rawTitles) {
      throw new Error('Failed to generate titles.')
    }
    
    // Parse the numbered list into a string array
    const titles = rawTitles.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(t => t.length > 0)

    return NextResponse.json({ titles })

  } catch (error) {
    console.error('Error in generate-title API:', error)
    return NextResponse.json({ error: 'Failed to process your request.' }, { status: 500 })
  }
} 