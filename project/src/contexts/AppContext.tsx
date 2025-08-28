import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Place, User, TripPlan, Mood } from '../types';
import { mockUser, mockTripPlans } from '../data/mockData';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  savedPlaces: Place[];
  setSavedPlaces: (places: Place[]) => void;
  tripPlans: TripPlan[];
  setTripPlans: (plans: TripPlan[]) => void;
  currentMood: Mood | null;
  setCurrentMood: (mood: Mood | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>(mockTripPlans);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const value = {
    user,
    setUser,
    savedPlaces,
    setSavedPlaces,
    tripPlans,
    setTripPlans,
    currentMood,
    setCurrentMood,
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};