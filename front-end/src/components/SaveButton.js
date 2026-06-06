import React, { useEffect, useState } from 'react';
import { API_BASE } from '../utils';
import './SaveButton.css';

export default function SaveButton({ listingId, variant = 'text' }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const token = localStorage.getItem('token');
      if (!token || !listingId) return;

      try {
        const res = await fetch(`${API_BASE}/saved-listings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setSaved(data.some((item) => item.listing?._id === listingId));
      } catch {
        setSaved(false);
      }
    };

    checkSaved();
  }, [listingId]);

  const toggleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save listings.');
      return;
    }

    try {
      if (saved) {
        const res = await fetch(`${API_BASE}/saved-listings/listing/${listingId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to remove saved listing');
        setSaved(false);
      } else {
        const res = await fetch(`${API_BASE}/saved-listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ listingId }),
        });

        if (!res.ok) throw new Error('Failed to save listing');
        setSaved(true);
      }
    } catch {
      alert('Unable to update saved listing. Please try again.');
    }
  };

  if (variant === 'icon') {
    return (
      <button
        className={'save-button icon' + (saved ? ' saved' : '')}
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? 'Unsave listing' : 'Save listing'}
      >
        <span className="heart">{saved ? '♥' : '♡'}</span>
      </button>
    );
  }

  return (
    <button
      className={'save-button' + (saved ? ' saved' : '')}
      onClick={toggleSave}
      aria-pressed={saved}
    >
      {saved ? 'Saved' : 'Save Listing'}
    </button>
  );
}