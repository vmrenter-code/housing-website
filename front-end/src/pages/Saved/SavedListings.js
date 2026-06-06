import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE } from '../../utils';
import './SavedListings.css';

export default function SavedListings() {
  const navigate = useNavigate();
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchSavedListings = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setFetchError('Please log in to view saved listings.');
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`${API_BASE}/saved-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setSavedListings(data);
    } catch {
      setFetchError('Failed to load saved listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const handleView = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const handleRemove = async (savedListingId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/saved-listings/${savedListingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSavedListings((prev) =>
        prev.filter((item) => item._id !== savedListingId)
      );
    } catch {
      alert('Unable to remove saved listing.');
    }
  };

  return (
    <div className="saved-page">
      <Navbar />

      <main style={{ padding: 24 }}>
        <h2>Saved Listings</h2>

        {loading && <p>Loading saved listings...</p>}

        {fetchError && (
          <p role="alert" style={{ color: '#b00020' }}>
            {fetchError}
          </p>
        )}

        {!loading && !fetchError && savedListings.length === 0 && (
          <div>No saved listings yet.</div>
        )}

        {!loading && savedListings.length > 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            {savedListings.map((savedItem) => {
              const listing = savedItem.listing;

              if (!listing) return null;

              return (
                <div
                  key={savedItem._id}
                  style={{
                    border: '1px solid #ddd',
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  <h3>{listing.title}</h3>
                  <div style={{ color: '#2b6cb0', fontWeight: 700 }}>
                    ${listing.price}/mo
                  </div>
                  <div>
                    {listing.university} • {listing.address} •{' '}
                    {listing.distanceToCampus} mi from campus
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => handleView(listing._id)}
                      style={{ marginRight: 8 }}
                    >
                      View
                    </button>
                    <button onClick={() => handleRemove(savedItem._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}