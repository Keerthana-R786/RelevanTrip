import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Camera, 
  MapPin, 
  Bookmark, 
  ExternalLink, 
  Bot,
  User,
  Volume2,
  MicOff
} from 'lucide-react';
import { ChatMessage } from '../types';
import { mockPlaces } from '../data/mockData';
import PlaceCard from '../components/common/PlaceCard';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI travel assistant. Tell me how you're feeling or what you're looking for, and I'll help you discover the perfect places!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const suggestions = getAISuggestions(inputText);
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputText),
        timestamp: new Date(),
        suggestions
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const getAISuggestions = (input: string): any[] => {
    // Simple keyword-based suggestions
    const keywords = input.toLowerCase();
    if (keywords.includes('happy') || keywords.includes('celebration')) {
      return mockPlaces.filter(p => ['restaurant', 'culture'].includes(p.category)).slice(0, 3);
    } else if (keywords.includes('sad') || keywords.includes('relax')) {
      return mockPlaces.filter(p => ['wellness', 'cafe'].includes(p.category)).slice(0, 3);
    } else if (keywords.includes('adventure') || keywords.includes('active')) {
      return mockPlaces.filter(p => ['adventure', 'outdoor'].includes(p.category)).slice(0, 3);
    } else if (keywords.includes('calm') || keywords.includes('peaceful')) {
      return mockPlaces.filter(p => ['outdoor', 'wellness'].includes(p.category)).slice(0, 3);
    } else {
      return mockPlaces.slice(0, 3);
    }
  };

  const generateAIResponse = (input: string): string => {
    const keywords = input.toLowerCase();
    
    if (keywords.includes('happy') || keywords.includes('celebration')) {
      return "I can sense your positive energy! 🌟 For happy moods, I recommend vibrant places where you can celebrate and enjoy good company. Here are some great options that match your joyful vibe:";
    } else if (keywords.includes('sad') || keywords.includes('down')) {
      return "I understand you might need some comfort right now. 💙 Here are some peaceful, nurturing places that can help lift your spirits and provide a calming atmosphere:";
    } else if (keywords.includes('adventure') || keywords.includes('exciting')) {
      return "Ready for some excitement! 🚀 I can tell you're in the mood for adventure. Here are some thrilling places that will get your adrenaline pumping:";
    } else if (keywords.includes('calm') || keywords.includes('peaceful') || keywords.includes('relax')) {
      return "Perfect for finding your zen! 🧘‍♀️ I've found some wonderfully tranquil places where you can unwind and reconnect with yourself:";
    } else if (keywords.includes('food') || keywords.includes('eat') || keywords.includes('hungry')) {
      return "Time to satisfy those taste buds! 🍽️ Based on what you're craving, here are some amazing dining experiences:";
    } else {
      return "Great question! Based on your preferences and current trends, I've found some fantastic places you might love:";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Travel Assistant</h1>
          <p className="text-gray-600">Chat with me to discover places that match your mood and preferences</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Place Suggestions */}
          {messages.length > 1 && messages[messages.length - 1].suggestions && (
            <div className="border-t border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {messages[messages.length - 1].suggestions?.map((place: any) => (
                  <div key={place.id} className="bg-gray-50 rounded-lg p-4">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-32 rounded-lg object-cover mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{place.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/place/${place.id}`, '_blank')}
                        className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                        <Bookmark className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tell me how you're feeling or what you're looking for..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <Mic className="mx-auto h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Voice Input</h3>
            <p className="text-sm text-gray-600">Speak naturally and I'll understand your mood</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <Camera className="mx-auto h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Mood Detection</h3>
            <p className="text-sm text-gray-600">AI analyzes your sentiment for better suggestions</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <MapPin className="mx-auto h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized places based on your preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;