import { NextResponse } from 'next/server'
import { ModelRouter } from '@/lib/ai/model-router'

const MAX_TEXT_LENGTH = 2000
const MIN_TEXT_LENGTH = 50

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

    // 在开发模式下，如果禁用了AI，则返回模拟数据
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_AI_IN_DEV === 'true') {
      console.log('💡 DEV-MODE: Returning mock data for tag generation.')
      return NextResponse.json({
        tags: [
          { tag: '#productivity', confidence: 0.95, category: 'Workflow' },
          { tag: '#knowledge-management', confidence: 0.89, category: 'Learning' },
          { tag: '#tools', confidence: 0.85, category: 'Technology' },
          { tag: '#efficiency', confidence: 0.78, category: 'Workflow' },
          { tag: '#organization', confidence: 0.76, category: 'Systems' },
          { tag: '#best-practices', confidence: 0.71, category: 'Methods' },
          { tag: '#automation', confidence: 0.68, category: 'Technology' },
          { tag: '#innovation', confidence: 0.65, category: 'Strategy' },
        ],
      })
    }

    // 构建 AI 提示词
    const prompt = `Analyze the following text and generate 5-10 relevant tags that would help categorize and organize this content. 

Text to analyze:
${text}

Please provide tags that are:
1. Descriptive and specific
2. Useful for knowledge management
3. Commonly used in professional contexts
4. Varied in scope (some broad, some specific)

Return the results in the following JSON format:
{
  "tags": [
    {
      "tag": "#example-tag",
      "confidence": 0.85,
      "category": "CategoryName"
    }
  ]
}

Categories should be one of: Technology, Learning, Workflow, Strategy, Communication, Research, Business, Creative, Personal, Systems, Methods, or Other.
Confidence should be between 0.5 and 1.0.
Always include the # symbol with tags.`

    const response = await ModelRouter.executeTask(
      'topic-extraction',
      [
        {
          role: 'system',
          content: 'You are an expert content analyst and knowledge management specialist. Generate relevant, professional tags for content organization. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      {
        temperature: 0.3,
        maxTokens: 400,
        isFreeTool: true
      }
    )

    let tags
    try {
      const content = response.content || '{"tags":[]}'
      // 清理可能的 markdown 格式
      const cleanContent = content.replace(/```json\s*|\s*```/g, '')
      const parsed = JSON.parse(cleanContent)
      tags = parsed.tags || []
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // 回退到简单的标签生成
      tags = [
        { tag: '#content', confidence: 0.8, category: 'General' },
        { tag: '#analysis', confidence: 0.7, category: 'Research' },
        { tag: '#organization', confidence: 0.6, category: 'Systems' }
      ]
    }

    return NextResponse.json({ tags })

  } catch (error) {
    console.error('Tag generation API error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
} 