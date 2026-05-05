import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchResults from './pages/SearchResults';
import MapView from './pages/MapView';
import './App.css'; 
import SignUp from './pages/SignUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;