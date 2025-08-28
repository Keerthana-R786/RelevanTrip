import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Users, 
  Shield, 
  Leaf, 
  Heart, 
  Bookmark,
  ExternalLink,
<<<<<<< HEAD
  Share2,
  Copy,
  Check
=======
  DollarSign
>>>>>>> c25b35716aec0623de46f555019edc0e9301a40b
} from 'lucide-react';
import { Place } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface PlaceCardProps {
  place: Place;
  showSaveButton?: boolean;
  showBookButton?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  showSaveButton = true, 
  showBookButton = true 
}) => {
  const { savedPlaces, setSavedPlaces } = useApp();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const isSaved = savedPlaces.some(p => p.id === place.id);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      setSavedPlaces(savedPlaces.filter(p => p.id !== place.id));
    } else {
      setSavedPlaces([...savedPlaces, place]);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async () => {
    const placeUrl = `${window.location.origin}/place/${place.id}`;
    try {
      await navigator.clipboard.writeText(placeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `Check out this amazing place: ${place.name}`,
          url: `${window.location.origin}/place/${place.id}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy link
      copyToClipboard();
    }
  };

  const getEcoTagColor = (tag: string) => {
    switch (tag) {
      case 'eco-friendly': return 'bg-green-100 text-green-800';
      case 'sustainable': return 'bg-blue-100 text-blue-800';
      case 'green-certified': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <Link to={`/place/${place.id}`} className="block">
        <div className="relative">
          <img 
            src={place.image} 
            alt={place.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEcoTagColor(place.ecoTag)}`}>
              <Leaf className="inline w-3 h-3 mr-1" />
              {place.ecoTag}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex space-x-2">
            {showSaveButton && (
              <button
                onClick={handleSave}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                  isSaved 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {isSaved ? <Heart className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 bg-white/80 text-gray-600 hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{place.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{place.address}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {place.description}
          </p>

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className={`h-4 w-4 ${getCrowdColor(place.crowdLevel)}`} />
                <span className="text-gray-600 capitalize">{place.crowdLevel}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">{place.safetyScore}/10</span>
              </div>
            </div>
            {place.price && (
              <div className="flex items-center space-x-1">
                {place.price !== 'Free' && <DollarSign className="h-3 w-3 text-gray-500" />}
                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                  place.price === 'Free' 
                    ? 'bg-green-100 text-green-800' 
                    : place.price.includes('$80') || place.price.includes('$150')
                      ? 'bg-purple-100 text-purple-800'
                      : place.price.includes('$45') || place.price.includes('$75')
                        ? 'bg-blue-100 text-blue-800'
                        : place.price.includes('$25') || place.price.includes('$40')
                          ? 'bg-orange-100 text-orange-800'
                          : place.price.includes('$15') || place.price.includes('$25')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                }`}>
                  {place.price}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {(showSaveButton || showBookButton) && (
        <div className="px-5 pb-5 flex space-x-2">
          <Link 
            to={`/place/${place.id}`}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-center text-sm"
          >
            View Details
          </Link>
          {showBookButton && (
            <button className="flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Book
            </button>
          )}
        </div>
      )}

      {/* Share Menu */}
      {showShareMenu && (
        <div 
          ref={shareMenuRef}
          className="absolute top-16 right-3 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20 min-w-[160px]"
        >
          <button
            onClick={shareViaWebAPI}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;