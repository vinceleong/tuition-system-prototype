export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: string[];
}

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry', 'Linear Algebra'],
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Quantum Physics', 'Relativity'],
  },
  {
    id: 'english',
    name: 'English',
    icon: '📖',
    topics: ['Grammar', 'Essay Writing', 'Literature', 'Reading Comprehension', 'Creative Writing', 'Public Speaking'],
  },
  {
    id: 'coding',
    name: 'Programming',
    icon: '💻',
    topics: ['JavaScript', 'Python', 'React', 'Data Structures', 'Algorithms', 'Web Development'],
  },
];
