import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Globe, 
  Eye, 
  Heart,
  Calendar,
  MapPin,
  Settings,
  Save,
  Download,
  Trash2,
  Star
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Profile: React.FC = () => {
  const { user, setUser, savedPlaces, tripPlans } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    moodDetection: user?.preferences.moodDetection || false,
    language: user?.preferences.language || 'English',
    privacy: user?.preferences.privacy || false
  });

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        preferences: {
          moodDetection: formData.moodDetection,
          language: formData.language,
          privacy: formData.privacy
        }
      });
    }
    alert('Settings saved successfully!');
  };

  const handleDownloadData = () => {
    const data = {
      user,
      savedPlaces,
      tripPlans,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relevantrip-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to permanently delete your account and all data? This action cannot be undone.');
    if (confirmed) {
      alert('Account deletion requested. This demo does not actually delete your account.');
    }
  };

  const handleChangePassword = () => {
    const newPassword = window.prompt('Enter a new password (demo):');
    if (newPassword && newPassword.length >= 6) {
      alert('Password updated successfully (demo).');
    } else if (newPassword !== null) {
      alert('Password must be at least 6 characters.');
    }
  };

  const handleLoginAlerts = () => {
    const next = !loginAlertsEnabled;
    setLoginAlertsEnabled(next);
    alert(`Login alerts ${next ? 'enabled' : 'disabled'}.`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'history', label: 'Travel History', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {user?.bio && (
                  <p className="mt-3 text-sm text-gray-700 px-2">{user.bio}</p>
                )}
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === id 
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself and your travel preferences..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Mood Detection</h3>
                        <p className="text-sm text-gray-600">Allow AI to analyze your mood for better recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.moodDetection}
                          onChange={(e) => setFormData({ ...formData, moodDetection: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                        <option value="German">Deutsch</option>
                        <option value="Portuguese">Português</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" id="email-notifications" className="rounded" />
                          <label htmlFor="email-notifications" className="text-gray-700">Email notifications for new recommendations</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" id="push-notifications" className="rounded" />
                          <label htmlFor="push-notifications" className="text-gray-700">Push notifications for trip updates</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" id="marketing-emails" className="rounded" />
                          <label htmlFor="marketing-emails" className="text-gray-700">Marketing emails and travel tips</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
                        <p className="text-sm text-gray-600">Make your profile and trips visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!formData.privacy}
                          onChange={(e) => setFormData({ ...formData, privacy: !e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <button onClick={handleDownloadData} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Download Your Data</h4>
                              <p className="text-sm text-gray-600">Get a copy of all your data</p>
                            </div>
                            <Download className="h-5 w-5 text-gray-400" />
                          </div>
                        </button>
                        
                        <button onClick={handleDeleteAccount} className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-red-900">Delete Account</h4>
                              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                            </div>
                            <Trash2 className="h-5 w-5 text-red-400" />
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Password & Security</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={handleChangePassword} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Change Password</h4>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </button>
                        
                        <button onClick={handleLoginAlerts} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Login Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified of account access</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel History</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 p-6 rounded-xl text-center">
                        <MapPin className="mx-auto h-8 w-8 text-green-500 mb-2" />
                        <div className="text-2xl font-bold text-green-600">24</div>
                        <div className="text-gray-600">Places Visited</div>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-xl text-center">
                        <Calendar className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold text-blue-600">6</div>
                        <div className="text-gray-600">Trips Completed</div>
                      </div>
                      
                      <div className="bg-purple-50 p-6 rounded-xl text-center">
                        <Heart className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                        <div className="text-2xl font-bold text-purple-600">42</div>
                        <div className="text-gray-600">Places Saved</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {[
                          { action: 'Visited Eco Gardens Café', date: '2 days ago', type: 'visit' },
                          { action: 'Saved Sunset Beach Park', date: '1 week ago', type: 'save' },
                          { action: 'Completed Weekend Adventure trip', date: '2 weeks ago', type: 'trip' },
                          { action: 'Rated Urban Art Museum', date: '3 weeks ago', type: 'review' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              activity.type === 'visit' ? 'bg-green-100 text-green-600' :
                              activity.type === 'save' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'trip' ? 'bg-purple-100 text-purple-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {activity.type === 'visit' ? <MapPin className="h-5 w-5" /> :
                               activity.type === 'save' ? <Heart className="h-5 w-5" /> :
                               activity.type === 'trip' ? <Calendar className="h-5 w-5" /> :
                               <Star className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;