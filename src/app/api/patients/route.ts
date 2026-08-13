import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function msToWaitTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function mapPatient(p: any) {
  const waitTime = p.createdAt
    ? msToWaitTime(Date.now() - new Date(p.createdAt).getTime())
    : 'N/A';

  return {
    _id: String(p._id),
    name: p.name,
    age: p.age,
    gender: p.gender,
    contact: p.contact,
    language: p.language || 'Hindi',
    symptoms: Array.isArray(p.symptoms) ? p.symptoms : [p.symptoms],
    symptomDuration: p.symptomDuration || 'Unknown',
    vitals: {
      temp: p.vitals?.temp ?? 0,
      bp: p.vitals?.bp ?? 'N/A',
      pulse: p.vitals?.pulse ?? 0,
      spO2: p.vitals?.spO2 ?? 0,
    },
    aiSummary: p.aiSummary || 'Pending AI assessment.',
    firstAidGuidance: p.recommendedFirstAid || 'Pending AI assessment.',
    aiPrescription: p.aiPrescription || '',
    requiresDoctor: p.requiresDoctor ?? false,
    triageLevel: p.triageLevel || (p.requiresDoctor ? 'RED' : 'GREEN'),
    status: p.status || 'waiting',
    imageUrl: p.imageUrl || undefined,
    videoRoomUrl: p.videoRoomUrl || '',
    createdAt: p.createdAt || new Date().toISOString(),
    waitTime,
  };
}

export async function GET() {
  try {
    let dbAvailable = false;
    try {
      const dbConnect = (await import('@/lib/mongodb')).default;
      await dbConnect();
      dbAvailable = true;
    } catch (e) {
      console.warn("MongoDB connection failed, using in-memory fallback. Ensure IP is whitelisted in MongoDB Atlas.");
    }
    
    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      const patients = await Patient.find({
        status: { $in: ['waiting', 'in-consultation'] },
      })
        .sort({ requiresDoctor: -1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        data: patients.map(mapPatient),
      });
    } else {
      const inMemoryPatients: any[] = (global as any).__inMemoryPatients || [];
      const filtered = inMemoryPatients
        .filter((p) => ['waiting', 'in-consultation'].includes(p.status))
        .sort((a, b) => (b.requiresDoctor ? 1 : 0) - (a.requiresDoctor ? 1 : 0));
      
      return NextResponse.json({
        success: true,
        data: filtered.map(mapPatient),
      });
    }
  } catch (error: any) {
    console.error('[Patients] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
