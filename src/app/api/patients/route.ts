import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function tryDbConnect() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const dbAvailable = await tryDbConnect();

    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      const patients = await Patient.find({ status: { $in: ['waiting', 'in-consultation'] } })
        .sort({ requiresDoctor: -1, createdAt: -1 });
      return NextResponse.json({ success: true, data: patients });
    } else {
      // Fallback: return from in-memory store
      const inMemoryPatients: any[] = (global as any).__inMemoryPatients || [];
      const filtered = inMemoryPatients
        .filter((p) => ['waiting', 'in-consultation'].includes(p.status))
        .sort((a, b) => (b.requiresDoctor ? 1 : 0) - (a.requiresDoctor ? 1 : 0));
      return NextResponse.json({ success: true, data: filtered });
    }
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
