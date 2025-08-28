export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  address: string;
  contact?: string;
  hours?: string;
  description: string;
  ecoTag: 'eco-friendly' | 'sustainable' | 'green-certified' | 'standard';
  safetyScore: number;
  crowdLevel: 'low' | 'medium' | 'high';
  weather?: string;
  latitude?: number;
  longitude?: number;
  price?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: {
    moodDetection: boolean;
    language: string;
    privacy: boolean;
  };
}

export interface TripPlan {
  id: string;
  name: string;
  places: Place[];
  date: string;
  userId: string;
  shared: boolean;
}

export type Mood = 'happy' | 'sad' | 'calm' | 'adventurous' | 'bored';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Place[];
}