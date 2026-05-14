import React, { useEffect, useState } from 'react';
import './SaveButton.css';

export default function SaveButton({ listingId, variant = 'text' }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('savedListings') || '[]');
      setSaved(Array.isArray(savedList) && savedList.includes(listingId));
    } catch (e) {
      setSaved(false);
    }
  }, [listingId]);

  const toggleSave = (e) => {
    e.preventDefault();
    try {
      const savedList = JSON.parse(localStorage.getItem('savedListings') || '[]');
      const next = Array.isArray(savedList) ? [...savedList] : [];
      const idx = next.indexOf(listingId);
      if (idx === -1) {
        next.push(listingId);
        setSaved(true);
      } else {
        next.splice(idx, 1);
        setSaved(false);
      }
      localStorage.setItem('savedListings', JSON.stringify(next));
    } catch (err) {
      const next = saved ? [] : [listingId];
      setSaved(!saved);
      localStorage.setItem('savedListings', JSON.stringify(next));
    }
  };

  if (variant === 'icon') {
    return (
      <button
        className={"save-button icon" + (saved ? ' saved' : '')}
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? 'Unsave listing' : 'Save listing'}
      >
        {/* Heart icon */}
        <span className="heart">{saved ? '♥' : '♡'}</span>
      </button>
    );
  }

  return (
    <button className={"save-button" + (saved ? ' saved' : '')} onClick={toggleSave} aria-pressed={saved}>
      {saved ? 'Saved' : 'Save Listing'}
    </button>
  );
}
