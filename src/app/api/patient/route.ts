import { NextResponse } from 'next/server';

const inMemoryPatients: any[] = [];
let idCounter = 1;

function generateId() {
  return `demo-patient-${idCounter++}-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let dbAvailable = false;
    try {
      const dbConnect = (await import('@/lib/mongodb')).default;
      await dbConnect();
      dbAvailable = true;
    } catch (e) {
      console.warn("MongoDB connection failed, using in-memory fallback. Ensure IP is whitelisted in MongoDB Atlas.");
    }

    if (dbAvailable) {
      const { getServerSession } = await import('next-auth');
      const { authOptions } = await import('@/lib/auth');
      const session = await getServerSession(authOptions);
      
      const Patient = (await import('@/models/Patient')).default;
      const newPatient = new Patient({
        ...body,
        workerId: session?.user?.id || '',
      });
      await newPatient.save();
      console.log('[Patient] Saved to MongoDB:', newPatient._id);
      return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
    } else {
      const newPatient = {
        _id: generateId(),
        ...body,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      inMemoryPatients.push(newPatient);
      (global as any).__inMemoryPatients = inMemoryPatients;
      return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
    }
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
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    const Patient = (await import('@/models/Patient')).default;
    const patients = await Patient.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: patients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
