import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: 'roomName is required' }, { status: 400 });
    }

    // In a real application, you would use a private token to authenticate
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (!DAILY_API_KEY) {
      console.warn("DAILY_API_KEY is not set. Assuming hackathon mock mode or missing env.");
    }

    const res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(DAILY_API_KEY && { Authorization: `Bearer ${DAILY_API_KEY}` }),
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'public', // Set public so we don't need user tokens for this hackathon phase
        properties: {
          exp: Math.round(Date.now() / 1000) + 60 * 60, // 1 hour expiry
        },
      }),
    });

    const room = await res.json();
    
    if (res.ok) {
      return NextResponse.json({ success: true, url: room.url });
    } else {
      // If room already exists, Daily returns a specific error. We can fetch the existing room.
      if (room.error === 'invalid-request-error' && room.info?.includes('already exists')) {
        const getRes = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
          method: 'GET',
          headers: {
            ...(DAILY_API_KEY && { Authorization: `Bearer ${DAILY_API_KEY}` }),
          },
        });
        const existingRoom = await getRes.json();
        if (getRes.ok) {
          return NextResponse.json({ success: true, url: existingRoom.url });
        }
      }
      return NextResponse.json(
        { success: false, error: room.info || 'Failed to create room' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Video Token Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
