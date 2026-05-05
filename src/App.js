import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchResults from './pages/SearchResults';
import MapView from './pages/MapView';
import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/map" element={<MapView />} />
    </Routes>
  );
}

export default App;
