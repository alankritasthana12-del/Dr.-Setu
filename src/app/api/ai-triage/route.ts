import { NextResponse } from 'next/server';
import { z } from 'zod';

const triageSchema = z.object({
  aiSummary: z.string().describe("A brief summary of the patient's condition based on symptoms and vitals."),
  firstAidSuggestions: z.string().describe("Basic first-aid protocols. Explicitly state you are not diagnosing."),
  requiresDoctor: z.boolean().describe("True if the condition is critical and requires a doctor, otherwise false.")
});

async function tryDbConnect() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    return true;
  } catch {
    return false;
  }
}

function getInMemoryPatient(patientId: string) {
  const inMemoryPatients: any[] = (global as any).__inMemoryPatients || [];
  return inMemoryPatients.find((p) => p._id === patientId);
}

function updateInMemoryPatient(patientId: string, updates: any) {
  const inMemoryPatients: any[] = (global as any).__inMemoryPatients || [];
  const idx = inMemoryPatients.findIndex((p) => p._id === patientId);
  if (idx !== -1) {
    Object.assign(inMemoryPatients[idx], updates);
    (global as any).__inMemoryPatients = inMemoryPatients;
  }
}

async function runAITriage(symptoms: string[], vitals: any) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    // Mock AI response for demo without API key
    return {
      aiSummary: `Patient presents with ${symptoms.join(', ')}. Vitals recorded: Temp ${vitals.temp || 'N/A'}°C, BP ${vitals.bp || 'N/A'}, Pulse ${vitals.pulse || 'N/A'} bpm, SpO2 ${vitals.spO2 || 'N/A'}%. NOTE: This is a demo response — no Gemini API key configured.`,
      firstAidSuggestions: `DISCLAIMER: I am not diagnosing. For demo purposes: ensure patient is comfortable, monitor vitals, keep hydrated. For real emergencies, call emergency services immediately.`,
      requiresDoctor: vitals.spO2 < 94 || vitals.pulse > 120 || vitals.temp > 38.5 || false,
    };
  }

  try {
    const { getGeminiModel } = await import('@/lib/langchain');
    const { HumanMessage, SystemMessage } = await import('@langchain/core/messages');
    const model = getGeminiModel();
    const structuredModel = model.withStructuredOutput(triageSchema, { name: "triage" });
    const systemPrompt = "You are an AI assistant. Analyze symptoms and vitals. If critical, set requiresDoctor to true. Provide ONLY basic first-aid protocols. Explicitly state you are not diagnosing.";
    const result = await structuredModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage({ content: `Patient Data:\nSymptoms: ${symptoms.join(', ')}\nVitals: ${JSON.stringify(vitals)}` })
    ]);
    return result;
  } catch (err) {
    console.error('Gemini AI error:', err);
    return {
      aiSummary: `Patient presents with ${symptoms.join(', ')}. AI analysis unavailable.`,
      firstAidSuggestions: 'DISCLAIMER: I am not diagnosing. Please consult a medical professional.',
      requiresDoctor: false,
    };
  }
}

export async function POST(req: Request) {
  try {
    const { patientId, images } = await req.json();

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const dbAvailable = await tryDbConnect();

    let patient: any;
    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      patient = await Patient.findById(patientId);
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
    } else {
      patient = getInMemoryPatient(patientId);
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
    }

    const result = await runAITriage(patient.symptoms, patient.vitals);

    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      await Patient.findByIdAndUpdate(patientId, {
        aiSummary: result.aiSummary,
        recommendedFirstAid: result.firstAidSuggestions,
        requiresDoctor: result.requiresDoctor,
        status: 'waiting',
      });
    } else {
      updateInMemoryPatient(patientId, {
        aiSummary: result.aiSummary,
        recommendedFirstAid: result.firstAidSuggestions,
        requiresDoctor: result.requiresDoctor,
        status: 'waiting',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        aiSummary: result.aiSummary,
        firstAidSuggestions: result.firstAidSuggestions,
        requiresDoctor: result.requiresDoctor,
      }
    });
  } catch (error: any) {
    console.error('AI Triage Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
