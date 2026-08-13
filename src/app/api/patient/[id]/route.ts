import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    let dbAvailable = false;
    try {
      const dbConnect = (await import('@/lib/mongodb')).default;
      await dbConnect();
      dbAvailable = true;
    } catch (e) {
      console.warn("MongoDB connection failed, using in-memory fallback.");
    }

    if (dbAvailable) {
      const Patient = (await import('@/models/Patient')).default;
      const updatedPatient = await Patient.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
      );
      if (!updatedPatient) {
        return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updatedPatient });
    } else {
      const inMemoryPatients: any[] = (global as any).__inMemoryPatients || [];
      const patientIndex = inMemoryPatients.findIndex(p => String(p._id) === id);
      if (patientIndex === -1) {
        return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
      }
      inMemoryPatients[patientIndex] = { ...inMemoryPatients[patientIndex], ...body };
      (global as any).__inMemoryPatients = inMemoryPatients;
      return NextResponse.json({ success: true, data: inMemoryPatients[patientIndex] });
    }
  } catch (error: any) {
    console.error('[Patient Update] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
