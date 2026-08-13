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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, error: 'GEMINI_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const promptText = `You are a professional medical translator. Translate the following medical text into ${targetLanguage}.
Ensure that the translation is accurate, easy to understand for a patient, and retains all medical meaning.
If the text contains any formatting like bold (**text**) or bullet points, preserve the formatting in the translation.

Text to translate:
${text}

Translation:`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.1,
        }
      })
    });

    if (!res.ok) {
       console.error('[Translation API] HTTP error:', res.status, await res.text());
       throw new Error('Failed to fetch translation from Gemini');
    }

    const data = await res.json();
    const translatedContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ success: true, data: translatedContent });
  } catch (error: any) {
    console.error('[Translation API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
