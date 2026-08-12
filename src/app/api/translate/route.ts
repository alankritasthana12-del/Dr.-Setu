import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { success: false, error: 'text and targetLanguage are required' },
        { status: 400 }
      );
    }

    if (targetLanguage === 'EN' || targetLanguage === 'English') {
        return NextResponse.json({ success: true, data: text });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, error: 'GEMINI_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const llm = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemini-1.5-flash',
      temperature: 0,
    });

    const prompt = PromptTemplate.fromTemplate(`
      You are a professional medical translator. Translate the following medical text into {targetLanguage}.
      Ensure that the translation is accurate, easy to understand for a patient, and retains all medical meaning.
      If the text contains any formatting like bold (**text**) or bullet points, preserve the formatting in the translation.
      
      Text to translate:
      {text}
      
      Translation:
    `);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({
      targetLanguage,
      text,
    });

    return NextResponse.json({ success: true, data: response.content });
  } catch (error: any) {
    console.error('[Translation API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
