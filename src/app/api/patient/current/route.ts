import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const workerId = userId;
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    
    const Patient = (await import('@/models/Patient')).default;
    
    // Find the most recent active patient (not completed) for this worker
    const currentPatient = await Patient.findOne({
      workerId,
      status: { $in: ['waiting', 'in-consultation'] }
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: currentPatient || null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
