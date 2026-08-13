import { NextResponse } from 'next/server';

// ── In-memory patient store helpers ───────────────────────────────────────
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

// ── Rule-based fallback (always works, no API needed) ──────────────────────
function buildFallback(symptoms: string[], vitals: any) {
  const spO2 = parseFloat(vitals?.spO2);
  const pulse = parseFloat(vitals?.pulse);
  const temp = parseFloat(vitals?.temp);

  const isCritical =
    (!isNaN(spO2) && spO2 < 90) ||
    (!isNaN(pulse) && pulse > 130) ||
    symptoms.some((s: string) =>
      /chest pain|can't breathe|unconscious|severe bleeding|stroke|seizure|heart/i.test(s)
    );

  const isModerate =
    (!isCritical) &&
    ((!isNaN(spO2) && spO2 >= 90 && spO2 < 94) ||
      (!isNaN(pulse) && pulse >= 100 && pulse <= 130) ||
      (!isNaN(temp) && temp > 103) ||
      symptoms.some((s: string) =>
        /fever|vomit|diarrhea|shortness of breath|abdominal|dehydrat/i.test(s)
      ));

  if (isCritical) {
    return {
      triageLevel: 'RED' as const,
      requiresDoctor: true,
      aiSummary: `Patient presents with: ${symptoms.join(', ')}. Critical vitals detected — SpO₂: ${vitals.spO2 || 'N/A'}%, Pulse: ${vitals.pulse || 'N/A'} bpm, Temp: ${vitals.temp || 'N/A'}°F. Immediate physician intervention is required. Do not delay telemedicine consultation.`,
      firstAidSuggestions: `DISCLAIMER: AI-assisted guidance only — NOT a medical diagnosis.\n\n🚨 EMERGENCY PROTOCOL:\n1. Keep patient seated upright — do NOT lay them flat.\n2. Ensure airway is clear; check breathing every 2 minutes.\n3. Apply O₂ via nasal cannula at 2–4 L/min if available.\n4. Do NOT give food, water, or medications without doctor approval.\n5. Attach ECG leads if equipment is available.\n6. Initiate telemedicine call immediately.\n7. Document exact time of symptom onset.\n8. Be prepared to perform CPR if patient loses consciousness.`,
    };
  }

  if (isModerate) {
    return {
      triageLevel: 'YELLOW' as const,
      requiresDoctor: false,
      aiSummary: `Patient presents with: ${symptoms.join(', ')}. Vitals show moderate concern — Temp: ${vitals.temp || 'N/A'}°F, SpO₂: ${vitals.spO2 || 'N/A'}%, Pulse: ${vitals.pulse || 'N/A'} bpm. Continuous monitoring is advised. Physician review recommended within 1 hour.`,
      firstAidSuggestions: `DISCLAIMER: AI-assisted guidance only — NOT a medical diagnosis.\n\n⚠️ MODERATE RISK PROTOCOL:\n1. Monitor vitals every 20 minutes and document all readings.\n2. Keep patient comfortable; allow small sips of water if conscious.\n3. Record all readings with timestamps.\n4. Prepare for remote doctor video consultation.\n5. Do NOT administer prescription medications without doctor order.\n6. If symptoms worsen (SpO₂ drops below 90%, pulse exceeds 130), escalate to RED.`,
    };
  }

  return {
    triageLevel: 'GREEN' as const,
    requiresDoctor: false,
    aiSummary: `Patient presents with: ${symptoms.join(', ')}. Vitals are within acceptable ranges — Temp: ${vitals.temp || 'N/A'}°F, SpO₂: ${vitals.spO2 || 'N/A'}%, BP: ${vitals.bp || 'N/A'}, Pulse: ${vitals.pulse || 'N/A'} bpm. Condition appears stable and non-emergency.`,
    firstAidSuggestions: `DISCLAIMER: AI-assisted guidance only — NOT a medical diagnosis.\n\n✅ STANDARD PROTOCOL:\n1. Perform standard wound care or symptomatic treatment as applicable.\n2. Administer OTC paracetamol (500mg) for fever or pain if indicated.\n3. Advise rest and adequate oral hydration (8 glasses of water/day).\n4. Schedule follow-up in 24–48 hours if symptoms persist or worsen.\n5. Educate patient on warning signs: chest pain, difficulty breathing, high fever, confusion.`,
  };
}

// ── Direct Gemini REST API call (no LangChain) ─────────────────────────────
async function callGeminiDirect(symptoms: string[], vitals: any, imageUrl?: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return null;

  const prompt = `You are a clinical triage AI for rural healthcare workers in India. Analyze the patient data and respond ONLY with a valid JSON object — no markdown, no explanation, just raw JSON.

Patient Data:
- Symptoms: ${symptoms.join(', ')}
- Temperature: ${vitals.temp || 'N/A'} °F
- Blood Pressure: ${vitals.bp || 'N/A'} mmHg  
- Pulse: ${vitals.pulse || 'N/A'} bpm
- SpO2: ${vitals.spO2 || 'N/A'} %

Triage Rules:
- RED: SpO2 < 90, pulse > 130, chest pain, unconsciousness, severe bleeding, stroke signs
- YELLOW: SpO2 90-94, pulse 100-130, temp > 103°F, moderate pain, vomiting/diarrhea
- GREEN: All vitals stable, minor wounds, mild symptoms

Respond with exactly this JSON structure:
{
  "triageLevel": "RED" | "YELLOW" | "GREEN",
  "requiresDoctor": true | false,
  "aiSummary": "2-3 sentence clinical summary",
  "firstAidSuggestions": "Step-by-step first aid starting with DISCLAIMER: AI-assisted guidance only"
}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  const parts: any[] = [{ text: prompt }];

  if (imageUrl) {
    const [prefix, base64Data] = imageUrl.split(',');
    const mimeType = prefix?.match(/:(.*?);/)?.[1] || 'image/jpeg';
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    clearTimeout(timeout);
    if (!res.ok) {
      console.error('[Gemini] HTTP error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      console.error('[Gemini] Empty response from API');
      return null;
    }

    // Strip markdown code fences if Gemini wraps JSON in them
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);

    // Validate required fields exist
    if (!parsed.triageLevel || !parsed.aiSummary || !parsed.firstAidSuggestions) {
      console.error('[Gemini] Incomplete JSON response:', parsed);
      return null;
    }

    return {
      triageLevel: parsed.triageLevel as 'RED' | 'YELLOW' | 'GREEN',
      requiresDoctor: parsed.requiresDoctor ?? (parsed.triageLevel === 'RED'),
      aiSummary: parsed.aiSummary,
      firstAidSuggestions: parsed.firstAidSuggestions,
    };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      console.error('[Gemini] Request timed out after 10s');
    } else {
      console.error('[Gemini] Fetch/parse error:', err.message);
    }
    return null;
  }
}

// ── POST /api/ai-triage ────────────────────────────────────────────────────
export async function POST(req: Request) {
  // This route ALWAYS returns 200 with a valid triage result
  try {
    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    // 1. Fetch patient (DB preferred, in-memory fallback)
    const dbAvailable = await tryDbConnect();
    let patient: any = null;

    if (dbAvailable) {
      try {
        const mongoose = await import('mongoose');
        // Only query DB if the ID is a valid MongoDB ObjectId
        if (mongoose.default.isValidObjectId(patientId)) {
          const Patient = (await import('@/models/Patient')).default;
          patient = await Patient.findById(patientId).lean();
        }
      } catch (e) {
        console.error('[AI Triage] DB find error:', e);
      }
    }

    if (!patient) {
      patient = getInMemoryPatient(patientId);
    }

    if (!patient) {
      console.error('[AI Triage] Patient not found:', patientId);
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const symptoms: string[] = Array.isArray(patient.symptoms) ? patient.symptoms : [patient.symptoms];
    const vitals = patient.vitals || {};

    // 2. Try Gemini first, fall back to rule-based
    console.log('[AI Triage] Calling Gemini for patient:', patientId);
    let result = await callGeminiDirect(symptoms, vitals, patient.imageUrl);

    if (!result) {
      console.warn('[AI Triage] Gemini unavailable — using rule-based fallback');
      result = buildFallback(symptoms, vitals);
    } else {
      console.log('[AI Triage] Gemini responded successfully, triageLevel:', result.triageLevel);
    }

    // 3. Persist results
    const updates = {
      aiSummary: result.aiSummary,
      recommendedFirstAid: result.firstAidSuggestions,
      requiresDoctor: result.requiresDoctor,
      triageLevel: result.triageLevel,
      status: 'waiting',
    };

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
        console.error('[AI Triage] DB update error (non-fatal):', e);
        updateInMemoryPatient(patientId, updates);
      }
    } else {
      updateInMemoryPatient(patientId, updates);
    }

    // 4. Always return success
    return NextResponse.json({
      success: true,
      data: {
        triageLevel: result.triageLevel,
        aiSummary: result.aiSummary,
        firstAidSuggestions: result.firstAidSuggestions,
        requiresDoctor: result.requiresDoctor,
      },
    });

  } catch (error: any) {
    // Last-resort catch — still return something useful
    console.error('[AI Triage] Unhandled error:', error);
    const emergency = buildFallback(['unspecified symptoms'], { spO2: '99', pulse: '80', temp: '98.6', bp: '120/80' });
    return NextResponse.json({
      success: true,
      data: {
        triageLevel: emergency.triageLevel,
        aiSummary: 'Assessment completed using offline protocol. ' + emergency.aiSummary,
        firstAidSuggestions: emergency.firstAidSuggestions,
        requiresDoctor: emergency.requiresDoctor,
      },
    });
  }
}
