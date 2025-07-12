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
      console.log('💡 DEV-MODE: Returning mock data for action item extraction.')
      return NextResponse.json({
        actionItems: [
          {
            id: 1,
            task: "Follow up with the design team on the new UI mockups",
            assignee: "Sarah",
            priority: "High",
            deadline: "2025-01-15",
            category: "Design",
            context: "Mentioned during discussion about Q1 deliverables"
          },
          {
            id: 2,
            task: "Schedule user testing sessions for the new feature",
            assignee: "Mike",
            priority: "Medium",
            deadline: "2025-01-20",
            category: "Research",
            context: "Part of the validation process for the dashboard"
          },
          {
            id: 3,
            task: "Update the project timeline and share with stakeholders",
            assignee: "Project Manager",
            priority: "High",
            deadline: "2025-01-10",
            category: "Planning",
            context: "Requested by leadership for next week's review"
          },
          {
            id: 4,
            task: "Research integration options for the new API",
            assignee: "Development Team",
            priority: "Medium",
            deadline: "2025-01-25",
            category: "Technical",
            context: "Needed for the backend optimization initiative"
          }
        ],
        summary: {
          totalItems: 4,
          highPriority: 2,
          mediumPriority: 2,
          lowPriority: 0,
          categories: ["Design", "Research", "Planning", "Technical"]
        }
      })
    }

    // 构建 AI 提示词
    const prompt = `Extract action items from the following text. Look for tasks, assignments, deadlines, and follow-up items.

Text to analyze:
${text}

Please identify:
1. Specific tasks or action items
2. Who is responsible (if mentioned)
3. Priority level (High/Medium/Low)
4. Deadlines or time frames (if mentioned)
5. Category/type of task
6. Context or background information

Return the results in the following JSON format:
{
  "actionItems": [
    {
      "id": 1,
      "task": "Clear, specific description of what needs to be done",
      "assignee": "Person or team responsible (or 'Unassigned' if not specified)",
      "priority": "High/Medium/Low",
      "deadline": "YYYY-MM-DD or 'No deadline specified'",
      "category": "Category name (e.g., Planning, Technical, Design, Research, Communication, etc.)",
      "context": "Brief context or background information"
    }
  ],
  "summary": {
    "totalItems": 0,
    "highPriority": 0,
    "mediumPriority": 0,
    "lowPriority": 0,
    "categories": []
  }
}

Guidelines:
- Extract only actionable items (things that require someone to do something)
- Be specific and clear in task descriptions
- Infer priority based on context, urgency words, or deadlines
- Use "Unassigned" if no specific person is mentioned
- Provide realistic deadline estimates if specific dates aren't given
- Categories should be professional and consistent`

    const response = await ModelRouter.executeTask(
      'topic-extraction',
      [
        {
          role: 'system',
          content: 'You are an expert project manager and task organizer. Extract actionable items from text with precision and clarity. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      {
        temperature: 0.2,
        maxTokens: 600,
        isFreeTool: true
      }
    )

    let actionData
    try {
      const content = response.content || '{"actionItems":[], "summary": {"totalItems": 0, "highPriority": 0, "mediumPriority": 0, "lowPriority": 0, "categories": []}}'
      // 清理可能的 markdown 格式
      const cleanContent = content.replace(/```json\s*|\s*```/g, '')
      actionData = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // 回退到基本结构
      actionData = {
        actionItems: [
          {
            id: 1,
            task: "Review and organize the provided content",
            assignee: "Unassigned",
            priority: "Medium",
            deadline: "No deadline specified",
            category: "General",
            context: "Extracted from provided text"
          }
        ],
        summary: {
          totalItems: 1,
          highPriority: 0,
          mediumPriority: 1,
          lowPriority: 0,
          categories: ["General"]
        }
      }
    }

    return NextResponse.json(actionData)

  } catch (error) {
    console.error('Action item extraction API error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
} 