export type SessionStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  tutorId: string;
  studentId: string;
  subjectId: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notes?: string;
  recordingUrl?: string;
}

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

function dateStr(daysFromNow: number): string {
  const date = new Date(y, m, d + daysFromNow);
  return date.toISOString().split('T')[0];
}

export const sessions: Session[] = [
  // Upcoming sessions
  {
    id: 'sess-1',
    tutorId: 'tutor-1',
    studentId: 'student-1',
    subjectId: 'math',
    topic: 'Quadratic Equations',
    date: dateStr(1),
    startTime: '14:00',
    endTime: '15:00',
    status: 'upcoming',
  },
  {
    id: 'sess-2',
    tutorId: 'tutor-4',
    studentId: 'student-2',
    subjectId: 'coding',
    topic: 'JavaScript Fundamentals',
    date: dateStr(2),
    startTime: '10:00',
    endTime: '11:30',
    status: 'upcoming',
  },
  {
    id: 'sess-3',
    tutorId: 'tutor-3',
    studentId: 'student-3',
    subjectId: 'math',
    topic: 'Calculus Derivatives',
    date: dateStr(3),
    startTime: '16:00',
    endTime: '17:00',
    status: 'upcoming',
  },
  {
    id: 'sess-4',
    tutorId: 'tutor-5',
    studentId: 'student-1',
    subjectId: 'english',
    topic: 'Essay Structure',
    date: dateStr(4),
    startTime: '09:00',
    endTime: '10:00',
    status: 'upcoming',
  },
  {
    id: 'sess-5',
    tutorId: 'tutor-2',
    studentId: 'student-3',
    subjectId: 'physics',
    topic: 'Wave Mechanics',
    date: dateStr(5),
    startTime: '13:00',
    endTime: '14:30',
    status: 'upcoming',
  },
  {
    id: 'sess-6',
    tutorId: 'tutor-6',
    studentId: 'student-2',
    subjectId: 'math',
    topic: 'Geometry Review',
    date: dateStr(6),
    startTime: '11:00',
    endTime: '12:00',
    status: 'upcoming',
  },
  {
    id: 'sess-7',
    tutorId: 'tutor-8',
    studentId: 'student-1',
    subjectId: 'physics',
    topic: 'Newton\'s Laws',
    date: dateStr(7),
    startTime: '15:00',
    endTime: '16:00',
    status: 'upcoming',
  },
  {
    id: 'sess-8',
    tutorId: 'tutor-7',
    studentId: 'student-2',
    subjectId: 'english',
    topic: 'Reading Comprehension',
    date: dateStr(8),
    startTime: '10:00',
    endTime: '11:00',
    status: 'upcoming',
  },
  // Completed sessions
  {
    id: 'sess-9',
    tutorId: 'tutor-1',
    studentId: 'student-1',
    subjectId: 'math',
    topic: 'Linear Equations',
    date: dateStr(-1),
    startTime: '14:00',
    endTime: '15:00',
    status: 'completed',
    notes: 'Emma is making great progress with linear equations. Assigned practice problems for next session.',
  },
  {
    id: 'sess-10',
    tutorId: 'tutor-4',
    studentId: 'student-3',
    subjectId: 'coding',
    topic: 'Python Basics',
    date: dateStr(-2),
    startTime: '10:00',
    endTime: '11:30',
    status: 'completed',
    notes: 'Sophia picked up Python loops quickly. Moving to functions next.',
  },
  {
    id: 'sess-11',
    tutorId: 'tutor-3',
    studentId: 'student-2',
    subjectId: 'math',
    topic: 'Fractions & Decimals',
    date: dateStr(-3),
    startTime: '16:00',
    endTime: '17:00',
    status: 'completed',
    notes: 'Liam needs more practice with fraction multiplication. Recommend worksheet.',
  },
  {
    id: 'sess-12',
    tutorId: 'tutor-5',
    studentId: 'student-1',
    subjectId: 'english',
    topic: 'Shakespeare Analysis',
    date: dateStr(-4),
    startTime: '09:00',
    endTime: '10:00',
    status: 'completed',
  },
  {
    id: 'sess-13',
    tutorId: 'tutor-6',
    studentId: 'student-3',
    subjectId: 'math',
    topic: 'Trigonometry Review',
    date: dateStr(-5),
    startTime: '11:00',
    endTime: '12:00',
    status: 'completed',
    notes: 'Excellent understanding of sine and cosine. Ready for tangent.',
  },
  {
    id: 'sess-14',
    tutorId: 'tutor-2',
    studentId: 'student-1',
    subjectId: 'physics',
    topic: 'Kinematics',
    date: dateStr(-6),
    startTime: '13:00',
    endTime: '14:30',
    status: 'completed',
    notes: 'Covered motion equations. Emma should complete set B of the problem booklet.',
  },
  {
    id: 'sess-15',
    tutorId: 'tutor-8',
    studentId: 'student-2',
    subjectId: 'physics',
    topic: 'Electric Circuits',
    date: dateStr(-7),
    startTime: '15:00',
    endTime: '16:00',
    status: 'completed',
  },
  {
    id: 'sess-16',
    tutorId: 'tutor-7',
    studentId: 'student-3',
    subjectId: 'english',
    topic: 'Essay Planning',
    date: dateStr(-8),
    startTime: '10:00',
    endTime: '11:00',
    status: 'completed',
    notes: 'Sophia wrote an excellent outline. Work on thesis statement clarity.',
  },
  {
    id: 'sess-17',
    tutorId: 'tutor-1',
    studentId: 'student-1',
    subjectId: 'math',
    topic: 'Systems of Equations',
    date: dateStr(-9),
    startTime: '14:00',
    endTime: '15:00',
    status: 'completed',
  },
  {
    id: 'sess-18',
    tutorId: 'tutor-4',
    studentId: 'student-2',
    subjectId: 'coding',
    topic: 'HTML & CSS Basics',
    date: dateStr(-10),
    startTime: '10:00',
    endTime: '11:30',
    status: 'completed',
    notes: 'Liam built his first webpage! Great enthusiasm.',
  },
  {
    id: 'sess-19',
    tutorId: 'tutor-3',
    studentId: 'student-3',
    subjectId: 'math',
    topic: 'Integration Techniques',
    date: dateStr(-11),
    startTime: '16:00',
    endTime: '17:00',
    status: 'completed',
  },
  {
    id: 'sess-20',
    tutorId: 'tutor-5',
    studentId: 'student-2',
    subjectId: 'english',
    topic: 'Creative Writing',
    date: dateStr(-12),
    startTime: '09:00',
    endTime: '10:00',
    status: 'completed',
    notes: 'Liam has a great imagination. Encourage more descriptive language.',
  },
  // Cancelled
  {
    id: 'sess-21',
    tutorId: 'tutor-6',
    studentId: 'student-1',
    subjectId: 'coding',
    topic: 'Intro to React',
    date: dateStr(-2),
    startTime: '13:00',
    endTime: '14:00',
    status: 'cancelled',
  },
];

export function getSessionsByUser(userId: string, role: string): Session[] {
  if (role === 'tutor') return sessions.filter((s) => s.tutorId === userId);
  if (role === 'student') return sessions.filter((s) => s.studentId === userId);
  return sessions;
}
