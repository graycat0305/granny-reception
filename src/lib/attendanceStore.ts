import fs from 'fs';
import path from 'path';

/**
 * Persisted store for tracking attended guests.
 * Writes to a dedicated data directory to prevent shadowing src/data
 */

const DATA_PATH = path.join(process.cwd(), 'data', 'attendance.json');

declare global {
  var attendedGuests: Set<string> | undefined;
}

const loadAttendanceStore = (): Set<string> => {
  if (global.attendedGuests) {
    return global.attendedGuests;
  }

  const store = new Set<string>();
  
  try {
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        parsed.forEach((id: string) => store.add(id));
      }
    }
  } catch (error) {
    console.error('Failed to read attendance store from file:', error);
  }

  global.attendedGuests = store;
  return store;
};

const saveAttendanceStore = (store: Set<string>) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_PATH, JSON.stringify(Array.from(store), null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save attendance store to file:', error);
  }
};

export const attendanceStore = loadAttendanceStore();

// Helper functions
export const markGuestAsAttended = (guestId: string) => {
  attendanceStore.add(guestId);
  saveAttendanceStore(attendanceStore);
};

export const hasGuestAttended = (guestId: string) => {
  return attendanceStore.has(guestId);
};
