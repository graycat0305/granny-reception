/**
 * In-memory global store for tracking attended guests.
 * We use global to prevent it from being reset during Next.js Hot Module Replacement in dev.
 */

declare global {
  var attendedGuests: Set<string> | undefined;
}

const getAttendanceStore = (): Set<string> => {
  if (!global.attendedGuests) {
    global.attendedGuests = new Set<string>();
  }
  return global.attendedGuests;
};

export const attendanceStore = getAttendanceStore();

// Helper functions
export const markGuestAsAttended = (guestId: string) => {
  attendanceStore.add(guestId);
};

export const hasGuestAttended = (guestId: string) => {
  return attendanceStore.has(guestId);
};
