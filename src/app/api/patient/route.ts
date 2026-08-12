import { NextResponse } from 'next/server';

// Pin in-memory store to global so it survives Next.js hot reloads
function getStore(): any[] {
  if (!(global as any).__inMemoryPatients) {
    (global as any).__inMemoryPatients = [];
    (global as any).__inMemoryIdCounter = 1;
  }
  return (global as any).__inMemoryPatients;
}

function generateId() {
  const counter = (global as any).__inMemoryIdCounter || 1;
  (global as any).__inMemoryIdCounter = counter + 1;
  return `demo-patient-${counter}-${Date.now()}`;
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
      try {
        const Patient = (await import('@/models/Patient')).default;
        const newPatient = new Patient(body);
        await newPatient.save();
        console.log('[Patient] Saved to MongoDB:', newPatient._id);
        return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
      } catch (dbErr: any) {
        console.error('[Patient] MongoDB save failed, using in-memory:', dbErr.message);
      }
    }

    // In-memory fallback
    const store = getStore();
    const newPatient = {
      _id: generateId(),
      ...body,
      aiSummary: '',
      recommendedFirstAid: '',
      requiresDoctor: false,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    store.push(newPatient);
    console.log('[Patient] Saved to in-memory store:', newPatient._id, '| Total:', store.length);
    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });

  } catch (error: any) {
    console.error('[Patient] Unhandled error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dbAvailable = await tryDbConnect();
    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      const patients = await Patient.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: patients });
    }
    const store = getStore();
    return NextResponse.json({ success: true, data: store });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
