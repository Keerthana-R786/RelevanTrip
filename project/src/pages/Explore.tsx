import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Grid } from 'lucide-react';
import PlaceCard from '../components/common/PlaceCard';
import { mockPlaces } from '../data/mockData';
import { Place } from '../types';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEcoTag, setSelectedEcoTag] = useState('all');
  const [selectedCrowd, setSelectedCrowd] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'restaurant', 'cafe', 'outdoor', 'culture', 'wellness', 'adventure'];
  const ecoTags = ['all', 'eco-friendly', 'sustainable', 'green-certified', 'standard'];
  const crowdLevels = ['all', 'low', 'medium', 'high'];

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      const matchesEcoTag = selectedEcoTag === 'all' || place.ecoTag === selectedEcoTag;
      const matchesCrowd = selectedCrowd === 'all' || place.crowdLevel === selectedCrowd;
      
      return matchesSearch && matchesCategory && matchesEcoTag && matchesCrowd;
    });
  }, [searchQuery, selectedCategory, selectedEcoTag, selectedCrowd]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Places</h1>
          <p className="text-gray-600">Discover amazing eco-friendly destinations around you</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for places, restaurants, cafes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {selectedCategory} ✕
              </span>
            )}
            {selectedEcoTag !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {selectedEcoTag} ✕
              </span>
            )}
            {selectedCrowd !== 'all' && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {selectedCrowd} crowd ✕
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{filteredPlaces.length} places found</span>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-green-500 text-white">
                <Grid className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eco Rating</label>
                <select
                  value={selectedEcoTag}
                  onChange={(e) => setSelectedEcoTag(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {ecoTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag === 'all' ? 'All Eco Tags' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crowd Level</label>
                <select
                  value={selectedCrowd}
                  onChange={(e) => setSelectedCrowd(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {crowdLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Crowd Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;