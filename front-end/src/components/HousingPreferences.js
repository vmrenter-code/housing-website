import React, {useState} from 'react';
import "./HousingPreferences.css"


export default function HousingPreferences() {
    const [budget, setBudget] = useState(1500);
    const [selectedBedroom, setSelectedBedroom] = useState('2');
    const [selectedAmenities, setSelectedAmenities] = useState(['Parking', 'Gym']);
    const [selectedDistance, setSelectedDistance] = useState('<1 mi');

    const bedroomOptions = ['Any', '1', '2', '3', '4+'];
    const amenityOptions = ['Parking', 'Gym', 'Laundry', 'Pool', 'Pet Friendly', 'Furnished'];
    const distanceOptions = ['<0.5 mi', '<1 mi', '<2 mi', 'Any'];

    const handleAmenityClick = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(item => item !== amenity)
                : [...prev, amenity]
        );
    };

    return (
        <section className="card">
            <h2>Housing Preferences</h2>

            {/* Budget Range */}
            <div className="input-group">
                <label>Budget Range (per month)</label>
                <input
                    type="range"
                    min="500"
                    max="3000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}/>
                <span className="sub-text-blue">$500 - ${budget} selected</span>
            </div>

            {/* Bedrooms */}
            <div className="input-group">
                <label>Bedrooms</label>
                <div className="btn-toggle-group">
                    {bedroomOptions.map(bedroom => (
                        <button
                            key={bedroom}
                            className={selectedBedroom === bedroom ? 'selected' : ''}
                            onClick={() => setSelectedBedroom(bedroom)}>
                            {bedroom}
                        </button>
                    ))}
                </div>
            </div>

            {/* Max Distance */}
            <div className="input-group">
                <label>Max Distance to Campus</label>
                <div className="distance-options">
                    {distanceOptions.map(distance => (
                        <button
                            key={distance}
                            className={selectedDistance === distance ? 'selected' : ''}
                            onClick={() => setSelectedDistance(distance)}>
                            {distance}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div className="input-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                    {amenityOptions.map(amenity => (
                        <button
                            key={amenity}
                            className={`chip ${selectedAmenities.includes(amenity) ? 'selected' : ''}`}
                            onClick={() => handleAmenityClick(amenity)}>
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

            <button className="save-btn">Save Preferences</button>
        </section>
    );
}