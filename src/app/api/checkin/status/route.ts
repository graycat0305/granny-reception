import { NextResponse } from 'next/server';
import { hasGuestAttended } from '@/lib/attendanceStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get('guestId');

  if (!guestId) {
    return NextResponse.json({ success: false, message: 'Missing guestId' }, { status: 400 });
  }

  const hasAttended = hasGuestAttended(guestId);

  return NextResponse.json({ success: true, hasAttended });
}
