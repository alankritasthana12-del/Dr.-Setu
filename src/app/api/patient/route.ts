import { NextResponse } from 'next/server';

// In-memory store for demo when MongoDB is not configured
const inMemoryPatients: any[] = [];
let idCounter = 1;

function generateId() {
  return `demo-patient-${idCounter++}-${Date.now()}`;
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dbAvailable = await tryDbConnect();

    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      const newPatient = new Patient(body);
      await newPatient.save();
      return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
    } else {
      // Fallback: in-memory store
      const newPatient = {
        _id: generateId(),
        ...body,
        aiSummary: '',
        recommendedFirstAid: '',
        requiresDoctor: false,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      inMemoryPatients.push(newPatient);
      // Store globally so other routes can access it
      (global as any).__inMemoryPatients = inMemoryPatients;
      return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
