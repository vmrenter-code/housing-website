import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import SearchResults from './pages/SearchResults/SearchResults';
import MapView from './pages/MapView/MapView';
import './App.css'; 
import SignUp from './pages/SignUp/SignUp';
import Notifications from './pages/Notifications/Notifications'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path = "/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default App;