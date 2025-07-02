import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化 OpenAI 客户端，指向 OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://notesorganizer.com',
    'X-Title': 'NotesOrganizer.com',
  },
});

export async function POST(request: Request) {
  // 1. 检查 API Key 是否配置
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return NextResponse.json(
      { error: 'Service not configured. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    // 2. 解析和验证输入
    const { text } = await request.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
    }

    // 3. 调用 OpenAI API，通过 OpenRouter
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // 使用 OpenRouter 的模型标识符
      messages: [
        {
          role: 'system',
          content: 'You are a highly skilled assistant that specializes in summarizing text. Your goal is to provide a concise, clear, and informative summary in a single paragraph.',
        },
        {
          role: 'user',
          content: `Please summarize the following text: \n\n${text}`,
        },
      ],
      temperature: 0.5, // 降低随机性，使摘要更稳定
      max_tokens: 150, // 限制输出长度
    });

    const summary = response.choices[0]?.message?.content?.trim();
    
    // 4. 返回结果
    if (!summary) {
      throw new Error('Failed to generate summary.');
    }

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error in summarize API:', error);
    // 避免向客户端暴露过多内部错误细节
    return NextResponse.json({ error: 'Failed to process your request.' }, { status: 500 });
  }
} 