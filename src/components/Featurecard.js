import React from 'react';
import './Featurecard.css';

export default function FeatureCard({ icon, title, desc, onClick }) {
  return (
    <div
      className={`feature-card ${onClick ? 'feature-card--clickable' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-desc">{desc}</p>
      </div>
    </div>
  );
}