export interface Chapter {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
}

export type PlaybookTrack = 'engineering' | 'design' | 'strategy' | 'Technical' | 'Professional' | 'Custom' | string;

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


