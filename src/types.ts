export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type Page = 'home' | 'courses' | 'enterprise' | 'blog' | 'live' | 'pricing' | 'login';

export interface Course {
  id: number;
  title: string;
  category: string;
  level: CourseLevel;
  duration: string;
  rating: number;
  students: number;
  instructor: string;
  image: string;
  price: string;
  featured?: boolean;
  description: string;
  lessons: number;
  certificate: boolean;
  tags: string[];
}

export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface Membership {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
  color: string;
}

export interface EnterpriseSolution {
  icon: string;
  title: string;
  description: string;
}

export interface RelatedCompany {
  name: string;
  industry: string;
  description: string;
  employees: string;
  result: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  summary: string;
  icon: string;
}

export interface LiveSession {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  level: CourseLevel;
  seats: number;
  topic: string;
  icon: string;
}

export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  modules: string[];
  outcome: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  comment: string;
  result: string;
}
