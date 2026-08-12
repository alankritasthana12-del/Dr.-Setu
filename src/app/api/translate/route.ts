import { NextResponse } from 'next/server';

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, error: 'GROQ_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const promptText = `You are a professional medical translator. Translate the following medical text into ${targetLanguage}.
Ensure that the translation is accurate, easy to understand for a patient, and retains all medical meaning.
If the text contains any formatting like bold (**text**) or bullet points, preserve the formatting in the translation.

Text to translate:
${text}

Translation:`;

    const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: promptText }],
        temperature: 0,
      })
    });

    if (!res.ok) {
       console.error('[Translation API] HTTP error:', res.status, await res.text());
       throw new Error('Failed to fetch translation from Groq');
    }

    const data = await res.json();
    const translatedContent = data?.choices?.[0]?.message?.content;

    return NextResponse.json({ success: true, data: translatedContent });
  } catch (error: any) {
    console.error('[Translation API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
