import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { API_BASE, isOnline, readOfflineCache, writeOfflineCache } from '../../utils';
import './SavedListings.css';

export default function SavedListings() {
  const navigate = useNavigate();
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [usingOfflineSaved, setUsingOfflineSaved] = useState(false);
  const online = useOnlineStatus();

  const fetchSavedListings = async () => {
    const cachedSavedListings = readOfflineCache('offlineSavedListings') || [];

    setLoading(true);
    setFetchError(null);
    setUsingOfflineSaved(false);

    if (!online) {
      if (cachedSavedListings.length > 0) {
        setSavedListings(cachedSavedListings);
        setUsingOfflineSaved(true);
      } else {
        setFetchError('Offline mode: no cached saved listings are available.');
      }
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setFetchError('Please log in to view saved listings.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/saved-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setSavedListings(data);
      writeOfflineCache('offlineSavedListings', data);
    } catch (err) {
      if (cachedSavedListings.length > 0) {
        setSavedListings(cachedSavedListings);
        setUsingOfflineSaved(true);
      }
      setFetchError('Failed to load saved listings. Showing cached results if available.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedListings();
  }, [online]);

  const handleView = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const handleRemove = async (savedListingId) => {
    if (!isOnline()) {
      alert('Offline mode: unable to remove saved listing until you reconnect.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to remove saved listings.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/saved-listings/${savedListingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSavedListings((prev) => {
        const updated = prev.filter((item) => item._id !== savedListingId);
        writeOfflineCache('offlineSavedListings', updated);
        return updated;
      });
    } catch {
      alert('Unable to remove saved listing.');
    }
  };

  return (
    <div className="saved-page">
      <Navbar />

      <main style={{ padding: 24 }}>
        <h2>Saved Listings</h2>

        {usingOfflineSaved && (
          <p className="offline-info">
            Offline mode: showing cached saved listings. You can view listings, but removals require reconnecting.
          </p>
        )}

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
                    <button
                      onClick={() => handleRemove(savedItem._id)}
                      disabled={!online}
                      style={{ opacity: online ? 1 : 0.5 }}
                    >
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