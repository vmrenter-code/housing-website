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
                <label htmlFor="budget-range">Budget Range (per month)</label>
                <input
                    id="budget-range"
                    type="range"
                    min="500"
                    max="3000"
                    value={preferences.budget || 1500}
                    onChange={(e) => onChange({ ...preferences, budget: Number(e.target.value) })} />
                <span className="sub-text-blue">$500 - ${preferences.budget || 1500} selected</span>
            </div>

            <div className="input-group">
                <label>Bedrooms</label>
                <div className="btn-toggle-group" role="group" aria-label="Bedroom options">
                    {bedroomOptions.map(bedroom => (
                        <button
                            key={bedroom}
                            type="button"
                            className={preferences.bedrooms === bedroom ? 'selected' : ''}
                            aria-pressed={preferences.bedrooms === bedroom}
                            onClick={() => onChange({ ...preferences, bedrooms: bedroom })}>
                            {bedroom}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-group">
                <label>Max Distance to Campus</label>
                <div className="distance-options" role="group" aria-label="Distance options">
                    {distanceOptions.map(distance => (
                        <button
                            key={distance}
                            type="button"
                            className={preferences.maxDistance === distance ? 'selected' : ''}
                            aria-pressed={preferences.maxDistance === distance}
                            onClick={() => onChange({ ...preferences, maxDistance: distance })}>
                            {distance}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-group">
                <label>Amenities</label>
                <div className="amenities-grid" role="group" aria-label="Amenity preferences">
                    {amenityOptions.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            className={`chip ${preferences.amenities?.includes(amenity) ? 'selected' : ''}`}
                            aria-pressed={preferences.amenities?.includes(amenity)}
                            onClick={() => handleAmenityClick(amenity)}>
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
