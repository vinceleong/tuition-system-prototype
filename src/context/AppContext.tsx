import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Role, User, Session, Payment, Assignment, Review, Message } from '../data';
import {
  students,
  tutors,
  parents,
  admins,
  getUserById,
  getSessionsByUser,
  getPaymentsByUser,
  getTutorEarnings,
  getOutstandingBalance,
  getMonthlyBills,
  getAssignmentsByUser,
  getReviewsByTutor,
  getReviewsByStudent,
  getConversationWithUser,
  getConversationPartners,
  subjects,
  allUsers,
  sessions,
  payments,
  assignments,
  reviews,
} from '../data';

interface AppState {
  currentRole: Role;
  currentUserId: string;
  currentUser: User;
  // Data
  users: User[];
  tutors: User[];
  students: User[];
  subjects: typeof subjects;
  sessions: Session[];
  payments: Payment[];
  assignments: Assignment[];
  reviews: Review[];
  // Helpers
  getSessions: () => Session[];
  getPayments: () => Payment[];
  getAssignments: () => Assignment[];
  getTutorEarnings: () => Payment[];
  getOutstandingBalance: () => number;
  getMonthlyBills: () => ReturnType<typeof getMonthlyBills>;
  getReviewsForTutor: (tutorId: string) => Review[];
  getReviewsForStudent: (studentId: string) => Review[];
  getConversationWith: (otherId: string) => Message[];
  getConversationPartners: () => string[];
  // Actions
  setRole: (role: Role) => void;
  setCurrentUserId: (id: string) => void;
  updateSessionStatus: (sessionId: string, status: Session['status']) => void;
  addPayment: (payment: Payment) => void;
  submitAssignment: (assignmentId: string) => void;
  gradeAssignment: (assignmentId: string, grade: string, feedback: string) => void;
  addReview: (review: Review) => void;
  sendMessage: (receiverId: string, text: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRoleState] = useState<Role>('student');
  const [currentUserId, setCurrentUserId] = useState('student-1');
  const [sessionState, setSessionState] = useState<Session[]>(sessions);
  const [paymentState, setPaymentState] = useState<Payment[]>(payments);
  const [assignmentState, setAssignmentState] = useState<Assignment[]>(assignments);
  const [reviewState, setReviewState] = useState<Review[]>(reviews);

  const setRole = useCallback((role: Role) => {
    setRoleState(role);
    if (role === 'student') setCurrentUserId('student-1');
    else if (role === 'tutor') setCurrentUserId('tutor-1');
    else if (role === 'parent') setCurrentUserId('parent-1');
    else if (role === 'admin') setCurrentUserId('admin-1');
  }, []);

  const currentUser = useMemo(() => getUserById(currentUserId)!, [currentUserId]);

  const getSessions = useCallback(() => getSessionsByUser(currentUserId, currentRole), [currentUserId, currentRole]);
  const getPayments = useCallback(() => getPaymentsByUser(currentUserId), [currentUserId]);
  const getAssignments = useCallback(() => getAssignmentsByUser(currentUserId, currentRole), [currentUserId, currentRole]);
  const getTutorEarningsFn = useCallback(() => getTutorEarnings(currentUserId), [currentUserId]);
  const getOutstandingBalanceFn = useCallback(() => getOutstandingBalance(currentUserId), [currentUserId]);
  const getMonthlyBillsFn = useCallback(() => getMonthlyBills(currentUserId), [currentUserId]);
  const getReviewsForTutor = useCallback((tutorId: string) => getReviewsByTutor(tutorId), []);
  const getReviewsForStudent = useCallback((studentId: string) => getReviewsByStudent(studentId), []);
  const getConversationWith = useCallback((otherId: string) => getConversationWithUser(currentUserId, otherId), [currentUserId]);
  const getConversationPartnersFn = useCallback(() => getConversationPartners(currentUserId), [currentUserId]);

  const updateSessionStatus = useCallback((sessionId: string, status: Session['status']) => {
    setSessionState((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status } : s)));
  }, []);

  const addPayment = useCallback((payment: Payment) => {
    setPaymentState((prev) => [...prev, payment]);
  }, []);

  const submitAssignment = useCallback((assignmentId: string) => {
    setAssignmentState((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'submitted' as const, submittedAt: new Date().toISOString().split('T')[0] } : a))
    );
  }, []);

  const gradeAssignment = useCallback((assignmentId: string, grade: string, feedback: string) => {
    setAssignmentState((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'graded' as const, grade, feedback } : a))
    );
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviewState((prev) => [...prev, review]);
  }, []);

  const sendMessage = useCallback((_receiverId: string, _text: string) => {
    // In a prototype, messages are read-only from static data
  }, []);

  const value = useMemo<AppState>(() => ({
    currentRole,
    currentUserId,
    currentUser,
    users: allUsers,
    tutors,
    students,
    subjects,
    sessions: sessionState,
    payments: paymentState,
    assignments: assignmentState,
    reviews: reviewState,
    getSessions,
    getPayments,
    getAssignments,
    getTutorEarnings: getTutorEarningsFn,
    getOutstandingBalance: getOutstandingBalanceFn,
    getMonthlyBills: getMonthlyBillsFn,
    getReviewsForTutor,
    getReviewsForStudent,
    getConversationWith,
    getConversationPartners: getConversationPartnersFn,
    setRole,
    setCurrentUserId,
    updateSessionStatus,
    addPayment,
    submitAssignment,
    gradeAssignment,
    addReview,
    sendMessage,
  }), [
    currentRole, currentUserId, currentUser,
    sessionState, paymentState, assignmentState, reviewState,
    getSessions, getPayments, getAssignments,
    getTutorEarningsFn, getOutstandingBalanceFn, getMonthlyBillsFn,
    getReviewsForTutor, getReviewsForStudent,
    getConversationWith, getConversationPartnersFn,
    setRole, updateSessionStatus, addPayment,
    submitAssignment, gradeAssignment, addReview, sendMessage,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
