export interface Chapter {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
}

export type PlaybookTrack = 'engineering' | 'design' | 'strategy' | 'Technical' | 'Professional' | 'Custom' | 'Consulting';

export interface Playbook {
  slug: string;
  title: string;
  subtitle: string;
  track: PlaybookTrack;
  price: number;
  featured: boolean;
  coverImage: string;
  summary: string;
  fullDesc: string;
  chapters: Chapter[];
}

export interface User {
  email: string;
  name: string;
  role: string;
  isPremium: boolean;
  joinedAt: string;
  phone?: string;
  savedScrollPositions?: Record<string, number>; // slug -> scroll percentage
}

export interface Purchase {
  slug: string;
  purchasedAt: string;
  scrollPosition?: number;
}

export interface ConsultingBooking {
  id: string;
  name: string;
  email: string;
  problem: string;
  budget: string;
  date: string;
  timeSlot: string;
  submittedAt: string;
}

export interface ProblemSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  problem: string;
  submittedAt: string;
  status: 'pending' | 'in_review' | 'resolved';
  paymentRef: string;
}
