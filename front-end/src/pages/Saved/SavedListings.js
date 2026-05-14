import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import listings from '../../data/mockListings';
import './SavedListings.css';

export default function SavedListings() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');
      setSavedIds(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setSavedIds([]);
    }
  }, []);

  const savedListings = listings.filter((l) => savedIds.includes(l.id));

  const handleView = (id) => {
    navigate(`/listing/${id}`);
  };

  const handleRemove = (id) => {
    const next = savedIds.filter((s) => s !== id);
    setSavedIds(next);
    localStorage.setItem('savedListings', JSON.stringify(next));
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h2>Saved Listings</h2>
        {savedListings.length === 0 ? (
          <div>No saved listings yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {savedListings.map((r) => (
              <div key={r.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                <h3>{r.title}</h3>
                <div style={{ color: '#2b6cb0', fontWeight: 700 }}>{r.price}</div>
                <div>{r.university} • {r.city} {r.zip ? `• ${r.zip}` : ''}</div>
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleView(r.id)} style={{ marginRight: 8 }}>View</button>
                  <button onClick={() => handleRemove(r.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
