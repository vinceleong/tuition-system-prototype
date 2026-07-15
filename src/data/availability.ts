// Weekly availability: day-of-week index (0=Mon..4=Fri) → time ranges per subject
export interface AvailabilitySlot {
  day: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
  startHour: number; // 8..19
  endHour: number;   // 9..20
}

// Tutor availability keyed by tutorId
export const tutorAvailability: Record<string, AvailabilitySlot[]> = {
  'tutor-1': [ // Dr. Sarah Chen — Math, Physics
    { day: 0, startHour: 9, endHour: 11 },
    { day: 1, startHour: 14, endHour: 16 },
    { day: 2, startHour: 9, endHour: 11 },
    { day: 3, startHour: 14, endHour: 17 },
    { day: 4, startHour: 9, endHour: 12 },
  ],
  'tutor-2': [ // Prof. James Mitchell — Physics
    { day: 0, startHour: 13, endHour: 17 },
    { day: 2, startHour: 13, endHour: 17 },
    { day: 4, startHour: 13, endHour: 16 },
  ],
  'tutor-3': [ // Maria Rodriguez — Math
    { day: 0, startHour: 8, endHour: 12 },
    { day: 1, startHour: 9, endHour: 15 },
    { day: 3, startHour: 8, endHour: 12 },
    { day: 4, startHour: 10, endHour: 14 },
  ],
  'tutor-4': [ // Alex Thompson — Coding
    { day: 1, startHour: 10, endHour: 12 },
    { day: 2, startHour: 14, endHour: 18 },
    { day: 3, startHour: 10, endHour: 13 },
    { day: 4, startHour: 14, endHour: 17 },
  ],
  'tutor-5': [ // Emily Watson — English
    { day: 0, startHour: 10, endHour: 13 },
    { day: 2, startHour: 9, endHour: 12 },
    { day: 4, startHour: 9, endHour: 11 },
  ],
  'tutor-6': [ // David Kim — Math, Coding
    { day: 0, startHour: 14, endHour: 17 },
    { day: 1, startHour: 9, endHour: 11 },
    { day: 1, startHour: 14, endHour: 16 },
    { day: 3, startHour: 10, endHour: 15 },
  ],
  'tutor-7': [ // Priya Patel — English
    { day: 0, startHour: 14, endHour: 17 },
    { day: 1, startHour: 10, endHour: 13 },
    { day: 3, startHour: 13, endHour: 17 },
  ],
  'tutor-8': [ // Michael Brown — Physics, Math
    { day: 1, startHour: 8, endHour: 12 },
    { day: 2, startHour: 11, endHour: 15 },
    { day: 3, startHour: 9, endHour: 12 },
    { day: 4, startHour: 8, endHour: 11 },
  ],
};

export function isTutorAvailableAt(tutorId: string, day: number, hour: number): boolean {
  const slots = tutorAvailability[tutorId];
  if (!slots) return false;
  return slots.some(s => s.day === day && hour >= s.startHour && hour < s.endHour);
}
