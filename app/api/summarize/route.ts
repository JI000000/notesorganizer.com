import { NextResponse } from 'next/server';
import { ModelRouter } from '@/lib/ai/model-router';

const MAX_TEXT_LENGTH = 2000; // 统一调整阈值为 2000
const MIN_TEXT_LENGTH = 50;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (typeof text !== 'string' || !text) {
      return NextResponse.json({ error: 'Input text is missing or invalid.' }, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Input text is too long. Maximum is ${MAX_TEXT_LENGTH} characters.` },
        { status: 413 } // 413 Payload Too Large
      );
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Input text is too short. Minimum is ${MIN_TEXT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 在开发模式下，如果禁用了AI，则返回模拟数据 (现在在验证之后)
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_AI_IN_DEV === 'true') {
      console.log('💡 DEV-MODE: Returning mock data for summarization.')
      // Simulate a delay to make the UX feel more realistic
      await new Promise(resolve => setTimeout(resolve, 500))
      return NextResponse.json({
        summary:
          'This is a mock summary returned in development mode. It demonstrates the functionality of the summarizer without incurring API costs. The original text discussed the importance of local development environments and how using mock data can significantly speed up testing cycles and reduce expenses. It also touched upon the trade-offs between different AI models for quality versus cost.',
      })
    }

    const result = await ModelRouter.executeTask(
      'summary-generation',
      [
        {
          role: 'system',
          content: 'You are a world-class expert in text summarization. Your task is to provide a concise, clear, and accurate summary of the given text. Focus on the main ideas and key takeaways.',
        },
        {
          role: 'user',
          content: `Please summarize the following text:\n\n${text}`,
        },
      ],
      {
        temperature: 0.5,
        maxTokens: 500,
        contentLength: text.length,
      }
    );

    if (!result.success || !result.content) {
      throw new Error(result.content || 'Failed to generate summary from the model.');
    }

    return NextResponse.json({ summary: result.content });

  } catch (error: any) {
    console.error('Error in summarize API:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
} 