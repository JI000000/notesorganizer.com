import { NextResponse } from 'next/server'
import { ModelRouter } from '@/lib/ai/model-router'

const MAX_TEXT_LENGTH = 2000 // 统一调整阈值为 2000
const MIN_TEXT_LENGTH = 50 // 设置一个最小长度以获得有意义的结果

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (typeof text !== 'string' || !text) {
      return NextResponse.json({ error: 'Input text is missing or invalid.' }, { status: 400 })
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Input text is too long. Maximum is ${MAX_TEXT_LENGTH} characters.` },
        { status: 413 }
      )
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Input text is too short. Minimum is ${MIN_TEXT_LENGTH} characters.` },
        { status: 400 }
      )
    }

    // 在开发模式下，如果禁用了AI，则返回模拟数据 (现在在验证之后)
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_AI_IN_DEV === 'true') {
      console.log('💡 DEV-MODE: Returning mock data for title generation.')
      return NextResponse.json({
        titles: [
          'Mock Title 1: The Art of Mocking',
          'Mock Title 2: Developing Without Costs',
          'Mock Title 3: A Guide to Test Data',
          'Mock Title 4: The Perfect Mock Response',
          'Mock Title 5: Speedy Development with Mocks',
        ],
      })
    }

    const result = await ModelRouter.executeTask(
      'title-generation',
      [
        {
          role: 'system',
          content:
            'You are a world-class expert in copywriting and content strategy. Your task is to generate exactly 5 compelling titles for a given piece of text. Please provide them in a numbered list format (1. Title one, 2. Title two, etc.), with each title on a new line. Do not add any extra text or commentary.',
        },
        {
          role: 'user',
          content: `Please generate 5 titles for the following text:\n\n${text}`,
        },
      ],
      {
        temperature: 0.7,
        maxTokens: 200,
        contentLength: text.length,
      }
    )

    if (!result.success || !result.content) {
      throw new Error(result.content || 'Failed to generate titles from the model.')
    }
    
    const titles = result.content
      .split('\n')
      .map(t => t.replace(/^\d+\.\s*/, '').trim())
      .filter(t => t.length > 0)

    return NextResponse.json({ titles })

  } catch (error: any) {
    console.error('Error in generate-title API:', error)
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 })
  }
} 