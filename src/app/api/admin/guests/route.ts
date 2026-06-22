import { NextResponse } from 'next/server';
import { hasGuestAttended } from '@/lib/attendanceStore';
import guestsData from '@/data/guests.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const enrichedGuests = guestsData.guests.map(guest => ({
      id: guest.id,
      name: guest.name,
      hasTicket: guest.hasTicket,
      hasAttended: hasGuestAttended(guest.id)
    }));

    return NextResponse.json({ success: true, guests: enrichedGuests });
  } catch (error) {
    console.error('Failed to fetch guests', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
