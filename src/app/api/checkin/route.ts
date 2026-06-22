import { NextResponse } from 'next/server';
import { markGuestAsAttended } from '@/lib/attendanceStore';
import guestsData from '@/data/guests.json';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestId } = body;

    if (!guestId) {
      return NextResponse.json({ success: false, message: 'Missing guestId' }, { status: 400 });
    }

    // Verify if the guest exists
    const guest = guestsData.guests.find((g) => g.id === guestId);
    if (!guest) {
      return NextResponse.json({ success: false, message: 'Guest not found' }, { status: 404 });
    }

    // Mark as attended
    markGuestAsAttended(guestId);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully checked in',
      guestName: guest.name
    });
  } catch (error) {
    console.error('Checkin API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
