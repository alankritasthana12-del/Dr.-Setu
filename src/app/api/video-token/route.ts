import { NextResponse } from 'next/server';

// Uses Jitsi Meet — free, open-source, no API key, no external calls that can fail.
// Room name is deterministic based on patientId so worker + doctor always join the same room.

export async function POST(req: Request) {
  try {
    let patientId: string | undefined;
    try {
      const body = await req.json();
      patientId = body?.patientId;
    } catch {
      // empty body is fine
    }

    // Deterministic room name based on patient ID
    const roomName = patientId
      ? `DrSetu-${patientId.replace(/[^a-zA-Z0-9]/g, '').slice(-16)}`
      : `DrSetu-${Date.now()}`;

    const roomUrl = `https://meet.jit.si/${roomName}`;

    // Optionally update patient status in DB
    if (patientId) {
      try {
        const dbConnect = (await import('@/lib/mongodb')).default;
        await dbConnect();
        const Patient = (await import('@/models/Patient')).default;
        await Patient.findByIdAndUpdate(patientId, {
          videoRoomUrl: roomUrl,
          status: 'in-consultation',
        });
      } catch {
        // Non-fatal — update in-memory store as fallback
        const store: any[] = (global as any).__inMemoryPatients || [];
        const idx = store.findIndex((p) => p._id === patientId);
        if (idx !== -1) {
          store[idx].videoRoomUrl = roomUrl;
          store[idx].status = 'in-consultation';
        }
      }
    }

    console.log('[Video] Room created:', roomUrl);
    return NextResponse.json({ success: true, url: roomUrl, roomName });
  } catch (error: any) {
    console.error('[Video Token] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
