import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Shield, 
  Cloud,
  Bookmark,
  ExternalLink,
  Heart,
  Share2,
  Navigation
} from 'lucide-react';
import { mockPlaces } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

const PlaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedPlaces, setSavedPlaces } = useApp();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const place = mockPlaces.find(p => p.id === id);
  const isSaved = savedPlaces.some(p => p.id === id);

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h1>
          <Link to="/explore" className="text-green-600 hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (isSaved) {
      setSavedPlaces(savedPlaces.filter(p => p.id !== place.id));
    } else {
      setSavedPlaces([...savedPlaces, place]);
    }
  };

  const getEcoTagColor = (tag: string) => {
    switch (tag) {
      case 'eco-friendly': return 'bg-green-100 text-green-800 border-green-200';
      case 'sustainable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green-certified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEcoTagColor(place.ecoTag)}`}>
                  {place.ecoTag}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
                    isSaved 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all hover:scale-110">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Place Info */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{place.rating}</span>
                    </div>
                    <span className="capitalize">{place.category}</span>
                    {place.price && <span className="font-semibold text-green-600">{place.price}</span>}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {place.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{place.address}</span>
                </div>
                {place.contact && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{place.contact}</span>
                  </div>
                )}
                {place.hours && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{place.hours}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Navigation className="h-5 w-5 mr-3 text-gray-400" />
                  <button className="text-green-600 hover:underline">Get Directions</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Book Now
              </button>
              <Link
                to="/trip-planner"
                className="bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all hover:scale-105 flex items-center justify-center"
              >
                <Bookmark className="h-5 w-5 mr-2" />
                Add to Trip Plan
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Data */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Crowd Level</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getCrowdColor(place.crowdLevel)}`}>
                    {place.crowdLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Safety Score</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${place.safetyScore * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{place.safetyScore}/10</span>
                  </div>
                </div>

                {place.weather && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Weather</span>
                    </div>
                    <span className="capitalize text-sm font-medium">{place.weather}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Places */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Places</h3>
              <div className="space-y-4">
                {mockPlaces
                  .filter(p => p.id !== place.id && p.category === place.category)
                  .slice(0, 3)
                  .map(similarPlace => (
                    <Link 
                      key={similarPlace.id}
                      to={`/place/${similarPlace.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={similarPlace.image} 
                        alt={similarPlace.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{similarPlace.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{similarPlace.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book {place.name}</h3>
            <p className="text-gray-600 mb-6">
              This would redirect to the booking system or external provider.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;