import { NextResponse } from 'next/server';

function getInMemoryPatient(patientId: string) {
  const store: any[] = (global as any).__inMemoryPatients || [];
  return store.find((p) => p._id === patientId) || null;
}

function updateInMemoryPatient(patientId: string, updates: any) {
  const store: any[] = (global as any).__inMemoryPatients || [];
  const idx = store.findIndex((p) => p._id === patientId);
  if (idx !== -1) {
    Object.assign(store[idx], updates);
    (global as any).__inMemoryPatients = store;
  }
}

async function tryDbConnect() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    return true;
  } catch {
    return false;
  }
}

async function callGeminiForPrescription(symptoms: string[], vitals: any, aiSummary: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return null;

  const prompt = `You are a clinical AI assisting a rural healthcare worker. The doctor is currently unavailable, and the worker needs an instant provisional prescription for the patient.

Patient Data:
- Symptoms: ${symptoms.join(', ')}
- Temperature: ${vitals.temp || 'N/A'} °F
- Blood Pressure: ${vitals.bp || 'N/A'} mmHg  
- Pulse: ${vitals.pulse || 'N/A'} bpm
- SpO2: ${vitals.spO2 || 'N/A'} %
- AI Triage Summary: ${aiSummary}

Provide a provisional prescription containing:
1. Recommended medications (OTC or safe generic equivalents for immediate relief).
2. Dosages and duration.
3. Instructions for the patient.

Important: Start your response with a clear, bold disclaimer that this is an AI-generated provisional prescription and a registered doctor must be consulted as soon as possible. Format the output in clean markdown.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 500,
          }
        }),
      }
    );

    clearTimeout(timeout);
    if (!res.ok) {
      console.error('[Gemini Prescription] HTTP error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return raw || null;
  } catch (err: any) {
    clearTimeout(timeout);
    console.error('[Gemini Prescription] Fetch/parse error:', err.message);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const dbAvailable = await tryDbConnect();
    let patient: any = null;

    if (dbAvailable) {
      try {
        const mongoose = await import('mongoose');
        if (mongoose.default.isValidObjectId(patientId)) {
          const Patient = (await import('@/models/Patient')).default;
          patient = await Patient.findById(patientId).lean();
        }
      } catch (e) {
        console.error('[AI Prescription] DB find error:', e);
      }
    }

    if (!patient) {
      patient = getInMemoryPatient(patientId);
    }

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const symptoms = Array.isArray(patient.symptoms) ? patient.symptoms : [patient.symptoms];
    const vitals = patient.vitals || {};
    const aiSummary = patient.aiSummary || '';

    let prescription = await callGeminiForPrescription(symptoms, vitals, aiSummary);

    if (!prescription) {
      prescription = "**DISCLAIMER: Provisional Prescription**\n\nUnable to generate AI prescription at this moment. Please ensure the patient rests, stays hydrated, and consults a doctor immediately.";
    }

    const updates = { aiPrescription: prescription };

    if (dbAvailable) {
      try {
        const mongoose = await import('mongoose');
        if (mongoose.default.isValidObjectId(patientId)) {
          const Patient = (await import('@/models/Patient')).default;
          await Patient.findByIdAndUpdate(patientId, updates);
        } else {
          updateInMemoryPatient(patientId, updates);
        }
      } catch (e) {
        updateInMemoryPatient(patientId, updates);
      }
    } else {
      updateInMemoryPatient(patientId, updates);
    }

    return NextResponse.json({
      success: true,
      data: { prescription },
    });

  } catch (error: any) {
    console.error('[AI Prescription] Unhandled error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
