import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prescription } = body;

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription text is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const prompt = `You are a clinical AI assisting a rural healthcare worker.
A prescription has been provided below. The medications in this prescription might not be available in the local village pharmacy.
Analyze the prescription, extract the active salts (ingredients) of each medication, and suggest 2-3 widely available substitute brand names or generic names for each in India (or generally).
Ensure the substitutes have the exact same salt composition and dosage if applicable.

Prescription:
${prescription}

Provide the response in clean markdown format, structured as a list of original medicines with their salts and substitutes. Start your response with a clear, bold disclaimer that a pharmacist or doctor must confirm the substitution before dispensing.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    clearTimeout(timeout);
    if (!res.ok) {
      console.error('[Gemini Substitutes] HTTP error:', res.status, await res.text());
      return NextResponse.json({ error: 'Failed to fetch substitutes from AI' }, { status: 500 });
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return NextResponse.json({
      success: true,
      data: raw || "No substitutes found.",
    });

  } catch (error: any) {
    console.error('[AI Substitutes] Unhandled error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
