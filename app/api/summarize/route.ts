import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
    }

    // This is where you would call your AI model API (e.g., OpenAI, Gemini)
    // For now, we will return a mock summary.
    // IMPORTANT: In a real application, you would replace this with:
    // const aiResponse = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages: [{ role: 'user', content: `Summarize the following text in one paragraph: ${text}` }],
    // });
    // const summary = aiResponse.choices[0].message.content;

    // Mocking the AI response with a delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockSummary = `This is a mock summary based on the provided text. In a real application, this would be a sophisticated, AI-generated paragraph that captures the core essence of the original content. The system successfully processed the input and is now returning a structured response, demonstrating the end-to-end functionality of the summarization micro-tool. The key takeaway is that the infrastructure is ready for a real AI model integration.`;
    
    return NextResponse.json({ summary: mockSummary });

  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 