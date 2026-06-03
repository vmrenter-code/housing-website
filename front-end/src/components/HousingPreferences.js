import React from 'react';
import "./HousingPreferences.css";



const bedroomOptions = ['Any', '1', '2', '3', '4+'];
const amenityOptions = ['Parking', 'Gym', 'Laundry', 'Pool', 'Pet Friendly', 'Furnished'];
const distanceOptions = ['<0.5 mi', '<1 mi', '<2 mi', 'Any'];

export default function HousingPreferences({ preferences, onChange }) {
    if (!preferences) return null;

    const handleAmenityClick = (amenity) => {
        const nextAmenities = preferences.amenities?.includes(amenity)
            ? preferences.amenities.filter(item => item !== amenity)
            : [...(preferences.amenities || []), amenity];

        onChange({ ...preferences, amenities: nextAmenities });
    };

    return (
        <section className="card">
            <h2>Housing Preferences</h2>

            <div className="input-group">
                <label>Budget Range (per month)</label>
                <input
                    type="range"
                    min="500"
                    max="3000"
                    value={preferences.budget || 1500}
                    onChange={(e) => onChange({ ...preferences, budget: Number(e.target.value) })} />
                <span className="sub-text-blue">$500 - ${preferences.budget || 1500} selected</span>
            </div>

            <div className="input-group">
                <label>Bedrooms</label>
                <div className="btn-toggle-group">
                    {bedroomOptions.map(bedroom => (
                        <button
                            key={bedroom}
                            className={preferences.bedrooms === bedroom ? 'selected' : ''}
                            onClick={() => onChange({ ...preferences, bedrooms: bedroom })}>
                            {bedroom}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-group">
                <label>Max Distance to Campus</label>
                <div className="distance-options">
                    {distanceOptions.map(distance => (
                        <button
                            key={distance}
                            className={preferences.maxDistance === distance ? 'selected' : ''}
                            onClick={() => onChange({ ...preferences, maxDistance: distance })}>
                            {distance}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                    {amenityOptions.map(amenity => (
                        <button
                            key={amenity}
                            className={`chip ${preferences.amenities?.includes(amenity) ? 'selected' : ''}`}
                            onClick={() => handleAmenityClick(amenity)}>
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
