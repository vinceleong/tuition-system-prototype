export type Role = 'student' | 'tutor' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  subjects?: string[];
  grade?: string;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  joinedAt: string;
}

const today = new Date();

function daysAgo(d: number): string {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  return date.toISOString().split('T')[0];
}

export const tutors: User[] = [
  {
    id: 'tutor-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@tuition.com',
    role: 'tutor',
    avatar: 'SC',
    subjects: ['math', 'physics'],
    bio: 'PhD in Applied Mathematics with 10+ years of teaching experience. Passionate about making complex concepts accessible to students of all levels.',
    hourlyRate: 75,
    rating: 4.9,
    reviewCount: 128,
    joinedAt: '2020-03-15',
  },
  {
    id: 'tutor-2',
    name: 'Prof. James Mitchell',
    email: 'james.mitchell@tuition.com',
    role: 'tutor',
    avatar: 'JM',
    subjects: ['physics'],
    bio: 'Former university physics professor. Specializes in preparing students for AP Physics and Olympiad competitions.',
    hourlyRate: 85,
    rating: 4.8,
    reviewCount: 94,
    joinedAt: '2019-09-01',
  },
  {
    id: 'tutor-3',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@tuition.com',
    role: 'tutor',
    avatar: 'MR',
    subjects: ['math'],
    bio: 'Certified math teacher specializing in middle and high school curriculum. Patient and encouraging approach.',
    hourlyRate: 55,
    rating: 4.7,
    reviewCount: 67,
    joinedAt: '2021-01-10',
  },
  {
    id: 'tutor-4',
    name: 'Alex Thompson',
    email: 'alex.thompson@tuition.com',
    role: 'tutor',
    avatar: 'AT',
    subjects: ['coding'],
    bio: 'Senior software engineer at a FAANG company. Teaches practical coding skills with real-world projects.',
    hourlyRate: 90,
    rating: 4.9,
    reviewCount: 156,
    joinedAt: '2020-06-20',
  },
  {
    id: 'tutor-5',
    name: 'Emily Watson',
    email: 'emily.watson@tuition.com',
    role: 'tutor',
    avatar: 'EW',
    subjects: ['english'],
    bio: 'Published author and English literature graduate from Oxford. Helps students master writing and analytical skills.',
    hourlyRate: 65,
    rating: 4.6,
    reviewCount: 43,
    joinedAt: '2022-02-14',
  },
  {
    id: 'tutor-6',
    name: 'David Kim',
    email: 'david.kim@tuition.com',
    role: 'tutor',
    avatar: 'DK',
    subjects: ['math', 'coding'],
    bio: 'Double major in Math and CS. Makes learning fun with interactive examples and gamified exercises.',
    hourlyRate: 60,
    rating: 4.8,
    reviewCount: 89,
    joinedAt: '2021-08-05',
  },
  {
    id: 'tutor-7',
    name: 'Priya Patel',
    email: 'priya.patel@tuition.com',
    role: 'tutor',
    avatar: 'PP',
    subjects: ['english'],
    bio: 'ESL specialist with 8 years of experience. Works with students from diverse linguistic backgrounds.',
    hourlyRate: 50,
    rating: 4.5,
    reviewCount: 52,
    joinedAt: '2022-11-01',
  },
  {
    id: 'tutor-8',
    name: 'Michael Brown',
    email: 'michael.brown@tuition.com',
    role: 'tutor',
    avatar: 'MB',
    subjects: ['physics', 'math'],
    bio: 'Engineering graduate who bridges theory and practice. Known for clear explanations and exam prep strategies.',
    hourlyRate: 70,
    rating: 4.7,
    reviewCount: 71,
    joinedAt: '2021-05-18',
  },
];

export const students: User[] = [
  {
    id: 'student-1',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'student',
    avatar: 'EJ',
    grade: '10th Grade',
    joinedAt: '2023-01-15',
  },
  {
    id: 'student-2',
    name: 'Liam Williams',
    email: 'liam.williams@example.com',
    role: 'student',
    avatar: 'LW',
    grade: '8th Grade',
    joinedAt: '2023-03-22',
  },
  {
    id: 'student-3',
    name: 'Sophia Davis',
    email: 'sophia.davis@example.com',
    role: 'student',
    avatar: 'SD',
    grade: '12th Grade',
    joinedAt: '2022-09-01',
  },
];

export const parents: User[] = [
  {
    id: 'parent-1',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'parent',
    avatar: 'RJ',
    joinedAt: '2023-01-15',
  },
];

export const admins: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@tuition.com',
    role: 'admin',
    avatar: 'AD',
    joinedAt: '2019-01-01',
  },
];

export const allUsers = [...tutors, ...students, ...parents, ...admins];

export function getUserById(id: string): User | undefined {
  return allUsers.find((u) => u.id === id);
}
