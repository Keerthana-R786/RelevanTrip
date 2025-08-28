import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import PlaceDetails from './pages/PlaceDetails';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import TripPlanner from './pages/TripPlanner';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;