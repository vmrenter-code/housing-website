import React, {useState} from 'react';
import "./HousingPreferences.css"


export default function HousingPreferences() {
    const [budget, setBudget] = useState(1500);

    return (
        <section className="card">
            <h2>Housing Preferences</h2>

            <div className="input-group">
                <label>Budget Range (per month)</label>
                <input
                    type="range"
                    min="500"
                    max="3000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />
                <span className="sub-text">$500 - ${budget} selected</span>
            </div>

            <div className="input-group">
                <label>Bedrooms</label>
                <div className="btn-toggle-group">
                    <button>Any</button>
                    <button>1</button>
                    <button className="selected">2</button>
                    <button>3</button>
                    <button>4+</button>
                </div>
            </div>

            <div className="input-group">
                <label>Max Distance to Campus</label>
                <select className="styled-select">
                    <option>&lt;0.5 mi</option>
                    <option selected>&lt;1 mi</option>
                    <option>&lt;2 mi</option>
                    <option>Any</option>
                </select>
            </div>

            <div className="input-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                    <button className="chip selected">Parking</button>
                    <button className="chip selected">Gym</button>
                    <button className="chip">Laundry</button>
                    <button className="chip">Pool</button>
                    <button className="chip">Pet Friendly</button>
                    <button className="chip">Furnished</button>
                </div>
            </div>

            <button className="save-btn">Save Preferences</button>
        </section>
    );
}