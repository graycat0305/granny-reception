import { notFound } from "next/navigation";
import guests from "@/data/guests.json";
import InvitationContainer from "@/components/InvitationContainer";
import { hasGuestAttended } from "@/lib/attendanceStore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { id } = await params;
  const guest = guests.guests.find((g) => g.id === id);

  if (!guest) {
    notFound();
  }

  const hasAttended = hasGuestAttended(guest.id);

  return <InvitationContainer guestName={guest.name} guestId={guest.id} hasTicket={guest.hasTicket ?? false} hasAttended={hasAttended} />;
}
