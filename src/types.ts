export interface Chapter {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
}

export type PlaybookTrack = 'engineering' | 'design' | 'strategy' | 'Technical' | 'Professional' | 'Custom' | 'Consulting' | string;

export interface Playbook {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  track: string;
  price: number;
  featured: boolean;
  coverImage: string;
  summary: string;
  fullDesc: string;
  isPublished?: boolean;
  chapters: Chapter[];
  createdAt?: string;
}

export interface BlogUpdate {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  fullContent: string;
  tagColor: string;
  coverImage?: string;
  isPublished?: boolean;
  publishedAt?: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  problem_title?: string;
  problem_type: 'predefined' | 'custom';
  details: string;
  amount_paid: number;
  payment_ref?: string;
  payment_status: string;
  status: 'pending' | 'in_review' | 'resolved';
  admin_note?: string;
  submitted_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isPremium: boolean;
  joinedAt: string;
  phone?: string;
  savedScrollPositions?: Record<string, number>;
}

export interface Purchase {
  slug: string;
  purchasedAt: string;
  scrollPosition?: number;
}

export interface Problem {
  category: string;
  title: string;
  desc: string;
  time: string;
  price: number;
  tagColor: "lavender" | "mint" | "blue" | string;
}
