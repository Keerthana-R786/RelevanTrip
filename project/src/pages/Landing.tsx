import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Bot, ArrowRight, Sparkles, MapPin, Leaf } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Sparkles className="mx-auto h-16 w-16 text-green-500 mb-4 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find the <span className="text-green-600">right place</span><br />
                at the <span className="text-blue-600">right time</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover amazing places with our mood-aware, eco-conscious AI travel assistant. 
                Get personalized suggestions based on how you feel, real-time crowd data, and sustainability ratings.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              <Link 
                to="/explore" 
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Search className="mx-auto h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manual Search</h3>
                <p className="text-gray-600 mb-4">
                  Browse and filter places by category, location, and eco-ratings
                </p>
                <div className="flex items-center justify-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              <Link 
                to="/dashboard#mood" 
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood-Based</h3>
                <p className="text-gray-600 mb-4">
                  Get personalized suggestions based on your current mood and feelings
                </p>
                <div className="flex items-center justify-center text-pink-600 font-medium group-hover:translate-x-2 transition-transform">
                  Share Your Mood <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              <Link 
                to="/assistant" 
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Bot className="mx-auto h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Chat with our AI to discover places that match your preferences
                </p>
                <div className="flex items-center justify-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RelevanTrip?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine AI technology with sustainability to help you discover places that matter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eco-Conscious</h3>
              <p className="text-gray-600">
                Every place comes with sustainability ratings and eco-friendly certifications
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood-Aware</h3>
              <p className="text-gray-600">
                Get suggestions that match your current emotional state and preferences
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Data</h3>
              <p className="text-gray-600">
                Live crowd levels, safety scores, and weather information for informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Places Discovered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Eco-Friendly</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Sustainable Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of eco-conscious travelers discovering amazing places
          </p>
          <Link 
            to="/explore"
            className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;