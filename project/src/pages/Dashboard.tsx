import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  MessageSquare,
  Smile,
  Frown,
  Meh,
  Zap,
  Coffee,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import PlaceCard from '../components/common/PlaceCard';
import { useApp } from '../contexts/AppContext';
import { mockPlaces } from '../data/mockData';
import { Mood } from '../types';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const { user, currentMood, setCurrentMood, savedPlaces, tripPlans } = useApp();
  const [moodSuggestions, setMoodSuggestions] = useState(mockPlaces.slice(0, 3));
  const [showMoodSelector, setShowMoodSelector] = useState(location.hash === '#mood');

  const moodOptions: { mood: Mood; icon: React.ReactNode; color: string; label: string }[] = [
    { mood: 'happy', icon: <Smile className="h-8 w-8" />, color: 'bg-yellow-500', label: 'Happy' },
    { mood: 'sad', icon: <Frown className="h-8 w-8" />, color: 'bg-blue-500', label: 'Sad' },
    { mood: 'calm', icon: <Meh className="h-8 w-8" />, color: 'bg-green-500', label: 'Calm' },
    { mood: 'adventurous', icon: <Zap className="h-8 w-8" />, color: 'bg-orange-500', label: 'Adventurous' },
    { mood: 'bored', icon: <Coffee className="h-8 w-8" />, color: 'bg-purple-500', label: 'Bored' },
  ];

  useEffect(() => {
    if (location.hash === '#mood') {
      setShowMoodSelector(true);
    }
  }, [location]);

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    // Mock AI mood-based suggestions
    const suggestions = mockPlaces
      .filter(place => {
        switch (mood) {
          case 'happy': return ['restaurant', 'culture'].includes(place.category);
          case 'sad': return ['wellness', 'cafe'].includes(place.category);
          case 'calm': return ['outdoor', 'wellness'].includes(place.category);
          case 'adventurous': return ['adventure', 'outdoor'].includes(place.category);
          case 'bored': return ['culture', 'restaurant'].includes(place.category);
          default: return true;
        }
      })
      .slice(0, 4);
    setMoodSuggestions(suggestions);
    setShowMoodSelector(false);
  };

  const recentPlaces = mockPlaces.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {currentMood ? `Based on your ${currentMood} mood, here are some personalized recommendations` : 'Let\'s discover some amazing places today'}
          </p>
        </div>

        {/* Mood Selector */}
        {(showMoodSelector || !currentMood) && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How are you feeling today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {moodOptions.map(({ mood, icon, color, label }) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    currentMood === mood 
                      ? `${color} text-white border-transparent shadow-lg` 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                  <span className="mt-2 font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Mood Display */}
        {currentMood && !showMoodSelector && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  {moodOptions.find(m => m.mood === currentMood)?.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">You're feeling {currentMood}</h3>
                  <p className="text-green-100">Here are places that match your vibe</p>
                </div>
              </div>
              <button
                onClick={() => setShowMoodSelector(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                Change Mood
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood-based Suggestions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentMood ? `${currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Recommendations` : 'Recommended for You'}
                </h2>
                <Link to="/explore" className="text-green-600 hover:text-green-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moodSuggestions.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </section>

            {/* Trending Places */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Trending Now</h2>
                </div>
                <Link to="/explore" className="text-green-600 hover:text-green-700 font-medium">
                  See More
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockPlaces.slice(3, 5).map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/assistant"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-900">Ask AI Assistant</span>
                </Link>
                <Link
                  to="/trip-planner"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-900">Plan a Trip</span>
                </Link>
                <Link
                  to="/explore"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-900">Explore Places</span>
                </Link>
              </div>
            </div>

            {/* Saved Places */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Saved Places</h3>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              {savedPlaces.length > 0 ? (
                <div className="space-y-3">
                  {savedPlaces.slice(0, 3).map(place => (
                    <Link
                      key={place.id}
                      to={`/place/${place.id}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{place.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-gray-600">{place.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {savedPlaces.length > 3 && (
                    <Link to="/trip-planner" className="block text-center text-green-600 hover:text-green-700 text-sm font-medium mt-2">
                      View All ({savedPlaces.length})
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No saved places yet</p>
              )}
            </div>

            {/* Active Trips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Trips</h3>
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              {tripPlans.length > 0 ? (
                <div className="space-y-3">
                  {tripPlans.slice(0, 2).map(trip => (
                    <Link
                      key={trip.id}
                      to="/trip-planner"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{trip.name}</h4>
                        <p className="text-xs text-gray-600">{trip.places.length} places</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600">{trip.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No active trips</p>
              )}
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
              <div className="space-y-3">
                {recentPlaces.map(place => (
                  <Link
                    key={place.id}
                    to={`/place/${place.id}`}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{place.name}</h4>
                      <p className="text-xs text-gray-600 capitalize">{place.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;