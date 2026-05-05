import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MapView() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '40px' }}>
        <h1>Map View</h1>
        <p>This page will show housing listings on an interactive map.</p>
      </main>
      <Footer />
    </div>
  );
}