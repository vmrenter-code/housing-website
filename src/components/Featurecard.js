import React from 'react';
import './Featurecard.css';

export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-desc">{desc}</p>
      </div>
    </div>
  );
}