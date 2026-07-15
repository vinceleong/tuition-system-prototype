export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  tutorId: string;
  studentId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  grade?: string;
  submittedAt?: string;
  feedback?: string;
}

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

function dateStr(daysFromNow: number): string {
  const date = new Date(y, m, d + daysFromNow);
  return date.toISOString().split('T')[0];
}

export const assignments: Assignment[] = [
  {
    id: 'asgn-1',
    tutorId: 'tutor-1',
    studentId: 'student-1',
    subjectId: 'math',
    title: 'Quadratic Equations Worksheet',
    description: 'Complete problems 1-20 on factoring and the quadratic formula. Show all work.',
    dueDate: dateStr(2),
    status: 'pending',
  },
  {
    id: 'asgn-2',
    tutorId: 'tutor-5',
    studentId: 'student-1',
    subjectId: 'english',
    title: 'Essay First Draft',
    description: 'Write a 5-paragraph argumentative essay on a topic of your choice. Include a clear thesis statement.',
    dueDate: dateStr(5),
    status: 'pending',
  },
  {
    id: 'asgn-3',
    tutorId: 'tutor-4',
    studentId: 'student-2',
    subjectId: 'coding',
    title: 'To-Do List App',
    description: 'Build a simple to-do list with JavaScript. Include add, delete, and mark-complete functionality.',
    dueDate: dateStr(3),
    status: 'submitted',
    submittedAt: dateStr(-1),
  },
  {
    id: 'asgn-4',
    tutorId: 'tutor-3',
    studentId: 'student-2',
    subjectId: 'math',
    title: 'Fraction Operations Practice',
    description: 'Complete the fraction operations packet. Focus on multiplication and division sections.',
    dueDate: dateStr(-1),
    status: 'submitted',
    submittedAt: dateStr(-2),
  },
  {
    id: 'asgn-5',
    tutorId: 'tutor-1',
    studentId: 'student-1',
    subjectId: 'math',
    title: 'Linear Equations Problem Set',
    description: '30 problems covering slope-intercept form and point-slope form.',
    dueDate: dateStr(-8),
    status: 'graded',
    grade: 'A-',
    submittedAt: dateStr(-9),
    feedback: 'Excellent work, Emma! Pay attention to sign conventions on problem 15. Overall very strong.',
  },
  {
    id: 'asgn-6',
    tutorId: 'tutor-2',
    studentId: 'student-1',
    subjectId: 'physics',
    title: 'Kinematics Problem Set B',
    description: 'Complete the problem booklet Set B as discussed in session.',
    dueDate: dateStr(-12),
    status: 'graded',
    grade: 'B+',
    submittedAt: dateStr(-13),
    feedback: 'Good understanding of motion equations. Review the distinction between velocity and speed.',
  },
  {
    id: 'asgn-7',
    tutorId: 'tutor-7',
    studentId: 'student-3',
    subjectId: 'english',
    title: 'Reading Analysis',
    description: 'Read chapter 5 and write a 2-page analysis of the author\'s use of symbolism.',
    dueDate: dateStr(1),
    status: 'pending',
  },
  {
    id: 'asgn-8',
    tutorId: 'tutor-6',
    studentId: 'student-3',
    subjectId: 'math',
    title: 'Trigonometry Applications',
    description: 'Real-world application problems involving sine, cosine, and tangent.',
    dueDate: dateStr(-3),
    status: 'graded',
    grade: 'A',
    submittedAt: dateStr(-4),
    feedback: 'Perfect score! Sophia demonstrates mastery of trigonometric applications.',
  },
];

export function getAssignmentsByUser(userId: string, role: string): Assignment[] {
  if (role === 'student') return assignments.filter((a) => a.studentId === userId);
  if (role === 'tutor') return assignments.filter((a) => a.tutorId === userId);
  return assignments;
}
