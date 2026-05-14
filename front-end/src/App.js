import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import SearchResults from './pages/SearchResults/SearchResults';
import MapView from './pages/MapView/MapView';
import './App.css';
import SignUp from './pages/Authentication/SignUp';
import Notifications from './pages/Notifications/Notifications'
import Login from "./pages/Authentication/Login";
import ListingDetailPage from './pages/ListingDetail/ListingDetailPage';
import SavedListings from './pages/Saved/SavedListings';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/search" element={<SearchResults/>}/>
            <Route path="/map" element={<MapView/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/notifications" element={<Notifications/>}/>
            <Route path="/saved" element={<SavedListings/>}/>
            <Route path="/listing/:id" element={<ListingDetailPage />} />
        </Routes>
    );
}

export default App;