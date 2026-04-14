import { notFound } from "next/navigation";
import guests from "@/data/guests.json";
import InvitationContainer from "@/components/InvitationContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { id } = await params;
  const guest = guests.guests.find((g) => g.id === id);

  if (!guest) {
    notFound();
  }

  return <InvitationContainer guestName={guest.name} />;
}
