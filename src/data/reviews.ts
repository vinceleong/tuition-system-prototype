export interface Review {
  id: string;
  tutorId: string;
  studentId: string;
  sessionId?: string;
  rating: number;
  text: string;
  date: string;
}

export const reviews: Review[] = [
  { id: 'rev-1', tutorId: 'tutor-1', studentId: 'student-1', sessionId: 'sess-9', rating: 5, text: 'Dr. Chen is incredible! She explains complex math concepts so clearly. I finally understand linear equations!', date: '2026-07-14' },
  { id: 'rev-2', tutorId: 'tutor-1', studentId: 'student-2', rating: 5, text: 'Best math tutor I\'ve ever had. Patient, knowledgeable, and makes learning fun.', date: '2026-06-20' },
  { id: 'rev-3', tutorId: 'tutor-1', studentId: 'student-3', rating: 4, text: 'Very thorough explanations. Sometimes moves a bit fast for me, but always willing to slow down when asked.', date: '2026-05-15' },
  { id: 'rev-4', tutorId: 'tutor-4', studentId: 'student-3', sessionId: 'sess-10', rating: 5, text: 'Alex is amazing! In just one session I went from zero Python knowledge to writing loops. Highly recommend.', date: '2026-07-14' },
  { id: 'rev-5', tutorId: 'tutor-4', studentId: 'student-2', rating: 5, text: 'The best coding teacher. Makes complex topics feel simple. I built my first website after two sessions!', date: '2026-07-08' },
  { id: 'rev-6', tutorId: 'tutor-2', studentId: 'student-1', sessionId: 'sess-14', rating: 4, text: 'Prof. Mitchell knows physics inside out. Great at connecting theory to real-world examples.', date: '2026-07-10' },
  { id: 'rev-7', tutorId: 'tutor-5', studentId: 'student-1', rating: 4, text: 'Emily helped me improve my essay writing significantly. My grades have gone up!', date: '2026-07-01' },
  { id: 'rev-8', tutorId: 'tutor-6', studentId: 'student-3', rating: 5, text: 'David makes math and coding fun. His gamified approach really works for me.', date: '2026-06-28' },
  { id: 'rev-9', tutorId: 'tutor-3', studentId: 'student-2', sessionId: 'sess-11', rating: 4, text: 'Maria is very patient and encouraging. Great for students who need extra confidence in math.', date: '2026-07-12' },
  { id: 'rev-10', tutorId: 'tutor-7', studentId: 'student-3', sessionId: 'sess-16', rating: 4, text: 'Priya\'s ESL background is really helpful. She understands common language pitfalls.', date: '2026-07-08' },
  { id: 'rev-11', tutorId: 'tutor-8', studentId: 'student-2', rating: 5, text: 'Michael connects physics concepts to engineering beautifully. Makes you appreciate the subject.', date: '2026-06-25' },
  { id: 'rev-12', tutorId: 'tutor-4', studentId: 'student-1', rating: 5, text: 'Helped me debug my React project. Alex knows exactly what questions to ask to guide you to the answer.', date: '2026-06-15' },
];

export function getReviewsByTutor(tutorId: string): Review[] {
  return reviews.filter((r) => r.tutorId === tutorId);
}

export function getReviewsByStudent(studentId: string): Review[] {
  return reviews.filter((r) => r.studentId === studentId);
}

export function getAverageRating(tutorId: string): number {
  const tutorReviews = getReviewsByTutor(tutorId);
  if (tutorReviews.length === 0) return 0;
  return tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;
}
