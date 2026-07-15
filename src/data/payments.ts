export interface Payment {
  id: string;
  userId: string;
  tutorId: string;
  sessionId?: string;
  amount: number;
  type: 'session_payment' | 'wallet_topup' | 'refund' | 'payout';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export const payments: Payment[] = [
  { id: 'pay-1', userId: 'student-1', tutorId: 'tutor-1', sessionId: 'sess-9', amount: 75, type: 'session_payment', status: 'completed', date: '2026-07-14', description: 'Math session - Linear Equations' },
  { id: 'pay-2', userId: 'student-1', tutorId: 'tutor-5', sessionId: 'sess-12', amount: 65, type: 'session_payment', status: 'completed', date: '2026-07-12', description: 'English session - Shakespeare Analysis' },
  { id: 'pay-3', userId: 'student-1', tutorId: 'tutor-2', sessionId: 'sess-14', amount: 85, type: 'session_payment', status: 'completed', date: '2026-07-10', description: 'Physics session - Kinematics' },
  { id: 'pay-4', userId: 'student-1', tutorId: 'tutor-1', sessionId: 'sess-17', amount: 75, type: 'session_payment', status: 'completed', date: '2026-07-07', description: 'Math session - Systems of Equations' },
  { id: 'pay-5', userId: 'student-1', tutorId: '', amount: 200, type: 'wallet_topup', status: 'completed', date: '2026-07-05', description: 'Wallet top-up' },
  { id: 'pay-6', userId: 'student-1', tutorId: 'tutor-6', amount: 60, type: 'refund', status: 'completed', date: '2026-07-13', description: 'Refund - Cancelled coding session' },
  { id: 'pay-7', userId: 'student-2', tutorId: 'tutor-4', sessionId: 'sess-10', amount: 90, type: 'session_payment', status: 'completed', date: '2026-07-13', description: 'Coding session - Python Basics' },
  { id: 'pay-8', userId: 'student-2', tutorId: 'tutor-3', sessionId: 'sess-11', amount: 55, type: 'session_payment', status: 'completed', date: '2026-07-12', description: 'Math session - Fractions & Decimals' },
  { id: 'pay-9', userId: 'student-2', tutorId: 'tutor-8', sessionId: 'sess-15', amount: 70, type: 'session_payment', status: 'completed', date: '2026-07-09', description: 'Physics session - Electric Circuits' },
  { id: 'pay-10', userId: 'student-2', tutorId: '', amount: 150, type: 'wallet_topup', status: 'completed', date: '2026-07-08', description: 'Wallet top-up' },
  { id: 'pay-11', userId: 'student-3', tutorId: 'tutor-3', sessionId: 'sess-13', amount: 55, type: 'session_payment', status: 'completed', date: '2026-07-11', description: 'Math session - Trigonometry' },
  { id: 'pay-12', userId: 'student-3', tutorId: 'tutor-7', sessionId: 'sess-16', amount: 50, type: 'session_payment', status: 'completed', date: '2026-07-08', description: 'English session - Essay Planning' },
  { id: 'pay-13', userId: 'student-3', tutorId: 'tutor-4', sessionId: 'sess-10', amount: 90, type: 'session_payment', status: 'completed', date: '2026-07-14', description: 'Coding session - Python Basics' },
  { id: 'pay-14', userId: 'student-3', tutorId: '', amount: 300, type: 'wallet_topup', status: 'completed', date: '2026-07-01', description: 'Monthly budget top-up' },
  { id: 'pay-15', userId: 'student-3', tutorId: '', amount: 55, type: 'refund', status: 'pending', date: '2026-07-14', description: 'Refund request - schedule conflict' },
];

export function getPaymentsByUser(userId: string): Payment[] {
  return payments.filter((p) => p.userId === userId);
}

export function getTutorEarnings(tutorId: string): Payment[] {
  return payments.filter((p) => p.tutorId === tutorId && p.type === 'session_payment' && p.status === 'completed');
}

export function getWalletBalance(userId: string): number {
  const topups = payments.filter((p) => p.userId === userId && p.type === 'wallet_topup' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const spent = payments.filter((p) => p.userId === userId && p.type === 'session_payment' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const refunds = payments.filter((p) => p.userId === userId && p.type === 'refund' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  return topups - spent + refunds;
}
