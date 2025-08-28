import React, { useState } from 'react';
import { Calendar, MapPin, Share2, Download, Plus, Trash2, Clock, Star, Edit3, HandIcon as GripVertical } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import PlaceCard from '../components/common/PlaceCard';

const TripPlanner: React.FC = () => {
  const { savedPlaces, tripPlans, setTripPlans } = useApp();
  const [selectedTrip, setSelectedTrip] = useState(tripPlans[0] || null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [newTripName, setNewTripName] = useState('');
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  const createNewTrip = () => {
    if (!newTripName.trim()) return;

    const newTrip = {
      id: `trip-${Date.now()}`,
      name: newTripName,
      places: [],
      date: format(new Date(), 'yyyy-MM-dd'),
      userId: 'user-1',
      shared: false
    };

    setTripPlans([...tripPlans, newTrip]);
    setSelectedTrip(newTrip);
    setNewTripName('');
    setShowNewTripForm(false);
  };

  const addPlaceToTrip = (placeId: string) => {
    if (!selectedTrip) return;

    const place = savedPlaces.find(p => p.id === placeId);
    if (!place || selectedTrip.places.some(p => p.id === placeId)) return;

    const updatedTrip = {
      ...selectedTrip,
      places: [...selectedTrip.places, place]
    };

    const updatedTrips = tripPlans.map(trip =>
      trip.id === selectedTrip.id ? updatedTrip : trip
    );

    setTripPlans(updatedTrips);
    setSelectedTrip(updatedTrip);
  };

  const removePlaceFromTrip = (placeId: string) => {
    if (!selectedTrip) return;

    const updatedTrip = {
      ...selectedTrip,
      places: selectedTrip.places.filter(p => p.id !== placeId)
    };

    const updatedTrips = tripPlans.map(trip =>
      trip.id === selectedTrip.id ? updatedTrip : trip
    );

    setTripPlans(updatedTrips);
    setSelectedTrip(updatedTrip);
  };

  const shareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedTrip?.name,
        text: `Check out my trip plan: ${selectedTrip?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const exportToPDF = () => {
    // Mock PDF export
    alert('PDF export would be implemented here with libraries like jsPDF or Puppeteer');
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!selectedTrip || fromIndex === toIndex) return;
    const newPlaces = [...selectedTrip.places];
    const [moved] = newPlaces.splice(fromIndex, 1);
    newPlaces.splice(toIndex, 0, moved);

    const updatedTrip = { ...selectedTrip, places: newPlaces };
    const updatedTrips = tripPlans.map(trip =>
      trip.id === selectedTrip.id ? updatedTrip : trip
    );
    setTripPlans(updatedTrips);
    setSelectedTrip(updatedTrip);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Planner</h1>
          <p className="text-gray-600">Organize your saved places into amazing travel itineraries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Trip List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Trips</h2>
                <button
                  onClick={() => setShowNewTripForm(true)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* New Trip Form */}
              {showNewTripForm && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Trip name"
                    value={newTripName}
                    onChange={(e) => setNewTripName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={createNewTrip}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewTripForm(false)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Trip List */}
              <div className="space-y-2">
                {tripPlans.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedTrip?.id === trip.id 
                        ? 'bg-green-50 border-2 border-green-200' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{trip.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{trip.places.length} places</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{format(new Date(trip.date), 'MMM d, yyyy')}</span>
                    </div>
                  </button>
                ))}

                {tripPlans.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No trips yet. Create your first trip!
                  </p>
                )}
              </div>
            </div>

            {/* Saved Places Quick Add */}
            {selectedTrip && savedPlaces.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Saved Places</h3>
                <div className="space-y-2">
                  {savedPlaces
                    .filter(place => !selectedTrip.places.some(p => p.id === place.id))
                    .slice(0, 5)
                    .map(place => (
                      <div key={place.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={place.image} 
                            alt={place.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900">{place.name}</span>
                        </div>
                        <button
                          onClick={() => addPlaceToTrip(place.id)}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTrip ? (
              <div className="space-y-6">
                {/* Trip Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTrip.name}</h2>
                      <div className="flex items-center space-x-4 text-gray-600 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(selectedTrip.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedTrip.places.length} places</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Full day</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={shareTrip}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Itinerary</h3>
                  
                  {selectedTrip.places.length > 0 ? (
                    <div className="space-y-4">
                      {selectedTrip.places.map((place, index) => (
                        <div
                          key={place.id}
                          className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                          onDragOver={(e) => {
                            if (dragIndex !== null) e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragIndex !== null) {
                              handleReorder(dragIndex, index);
                              setDragIndex(null);
                            }
                          }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={place.image} 
                                  alt={place.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{place.name}</h4>
                                  <p className="text-sm text-gray-600 mb-1">{place.address}</p>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                      <span className="text-sm text-gray-600">{place.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-600 capitalize">• {place.category}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  draggable
                                  onDragStart={() => setDragIndex(index)}
                                  onDragEnd={() => setDragIndex(null)}
                                  aria-label="Reorder"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => removePlaceFromTrip(place.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No places added yet</h3>
                      <p className="text-gray-500 mb-4">
                        Add places from your saved list or explore new destinations
                      </p>
                    </div>
                  )}
                </div>

                {/* Trip Stats */}
                {selectedTrip.places.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                      <MapPin className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedTrip.places.length}</div>
                      <div className="text-gray-600">Places to Visit</div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                      <Star className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {(selectedTrip.places.reduce((sum, place) => sum + place.rating, 0) / selectedTrip.places.length).toFixed(1)}
                      </div>
                      <div className="text-gray-600">Avg Rating</div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                      <Clock className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.max(6, selectedTrip.places.length * 2)}h
                      </div>
                      <div className="text-gray-600">Est. Duration</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No trip selected</h3>
                <p className="text-gray-500">
                  Select an existing trip or create a new one to start planning your adventure
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;