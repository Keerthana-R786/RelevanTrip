import { Place, User, TripPlan } from '../types';

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Eco Gardens Café',
    category: 'restaurant',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '123 Green Street, Eco District',
    contact: '+1 (555) 123-4567',
    hours: '8:00 AM - 9:00 PM',
    description: 'A sustainable café serving organic, locally-sourced meals in a beautiful garden setting.',
    ecoTag: 'eco-friendly',
    safetyScore: 9.2,
    crowdLevel: 'medium',
    weather: 'sunny',
    price: '$$'
  },
  {
    id: '2',
    name: 'Sunset Beach Park',
    category: 'outdoor',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '456 Coastal Highway, Beach Town',
    hours: '6:00 AM - 10:00 PM',
    description: 'A pristine beach park with walking trails and stunning sunset views.',
    ecoTag: 'green-certified',
    safetyScore: 8.7,
    crowdLevel: 'low',
    weather: 'cloudy',
    price: 'Free'
  },
  {
    id: '3',
    name: 'Urban Art Museum',
    category: 'culture',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '789 Culture Avenue, Arts District',
    contact: '+1 (555) 987-6543',
    hours: '10:00 AM - 6:00 PM',
    description: 'Contemporary art museum featuring local and international artists.',
    ecoTag: 'sustainable',
    safetyScore: 9.5,
    crowdLevel: 'high',
    weather: 'rainy',
    price: '$$$'
  },
  {
    id: '4',
    name: 'Mountain Trail Coffee',
    category: 'cafe',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1833399/pexels-photo-1833399.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '321 Mountain View Road',
    contact: '+1 (555) 456-7890',
    hours: '6:00 AM - 8:00 PM',
    description: 'Cozy mountain café with locally roasted coffee and hiking trail access.',
    ecoTag: 'eco-friendly',
    safetyScore: 8.9,
    crowdLevel: 'low',
    weather: 'sunny',
    price: '$'
  },
  {
    id: '5',
    name: 'Riverside Wellness Spa',
    category: 'wellness',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/3188831/pexels-photo-3188831.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '654 River Walk, Wellness District',
    contact: '+1 (555) 234-5678',
    hours: '9:00 AM - 8:00 PM',
    description: 'Tranquil spa offering eco-friendly treatments by the river.',
    ecoTag: 'green-certified',
    safetyScore: 9.0,
    crowdLevel: 'medium',
    weather: 'sunny',
    price: '$$$$'
  },
  {
    id: '6',
    name: 'Adventure Sports Center',
    category: 'adventure',
    rating: 4.4,
    image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '987 Adventure Lane, Sports Complex',
    contact: '+1 (555) 345-6789',
    hours: '7:00 AM - 9:00 PM',
    description: 'Extreme sports facility with rock climbing, kayaking, and more.',
    ecoTag: 'standard',
    safetyScore: 8.3,
    crowdLevel: 'high',
    weather: 'clear',
    price: '$$$'
  }
];

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  preferences: {
    moodDetection: true,
    language: 'English',
    privacy: false
  }
};

export const mockTripPlans: TripPlan[] = [
  {
    id: 'trip-1',
    name: 'Weekend Eco Adventure',
    places: [mockPlaces[0], mockPlaces[1], mockPlaces[4]],
    date: '2025-01-25',
    userId: 'user-1',
    shared: false
  }
];