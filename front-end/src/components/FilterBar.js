import React, { useState } from 'react';
import './FilterBar.css';

export default function FilterBar({
  onSortChange,
  onPriceChange,
  onBedroomsChange,
  onHomeTypeChange,
  onDistanceChange,
  priceRange,
  selectedBedrooms,
  selectedHomeTypes,
  selectedDistance,
}) {
  const [sortBy, setSortBy] = useState('relevance');
  const [openFilter, setOpenFilter] = useState(null);
  const [priceMin, setPriceMin] = useState(priceRange?.min || 0);
  const [priceMax, setPriceMax] = useState(priceRange?.max || 2000);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  const handleFilterToggle = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handlePriceMinChange = (e) => {
    const newMin = parseInt(e.target.value, 10);
    setPriceMin(newMin);
    onPriceChange({ min: newMin, max: priceMax });
  };

  const handlePriceMaxChange = (e) => {
    const newMax = parseInt(e.target.value, 10);
    setPriceMax(newMax);
    onPriceChange({ min: priceMin, max: newMax });
  };

  const handleBedroomToggle = (bedroom) => {
    const newBedrooms = selectedBedrooms.includes(bedroom)
      ? selectedBedrooms.filter((b) => b !== bedroom)
      : [...selectedBedrooms, bedroom];
    onBedroomsChange(newBedrooms);
  };

  const handleHomeTypeToggle = (type) => {
    const newTypes = selectedHomeTypes.includes(type)
      ? selectedHomeTypes.filter((t) => t !== type)
      : [...selectedHomeTypes, type];
    onHomeTypeChange(newTypes);
  };

  return (
    <div className="filter-bar">
      <div className={`filter-bar-left ${mobileFiltersVisible ? 'mobile-expanded' : ''}`}>
        <div className="filter-bar-item">
          <button
            type="button"
            className="filter-bar-btn"
            onClick={() => handleFilterToggle('price')}
          >
            Price
          </button>
          {openFilter === 'price' && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={handlePriceMinChange}
                    placeholder="Min"
                    className="price-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={handlePriceMaxChange}
                    placeholder="Max"
                    className="price-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="filter-bar-item">
          <button
            type="button"
            className="filter-bar-btn"
            onClick={() => handleFilterToggle('bedrooms')}
          >
            Bed/Baths
          </button>
          {openFilter === 'bedrooms' && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Bedrooms</label>
                {[1, 2, 3, 4].map((bedroom) => (
                  <label key={bedroom} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBedrooms.includes(bedroom)}
                      onChange={() => handleBedroomToggle(bedroom)}
                    />
                    {bedroom} Bed{bedroom > 1 ? 's' : ''}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-bar-item">
          <button
            type="button"
            className="filter-bar-btn"
            onClick={() => handleFilterToggle('homeType')}
          >
            Home Type
          </button>
          {openFilter === 'homeType' && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Property Type</label>
                {['Studio', 'Apartment', 'House', 'Loft'].map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedHomeTypes.includes(type)}
                      onChange={() => handleHomeTypeToggle(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-bar-item filter-bar-distance">
          <button
            type="button"
            className="filter-bar-btn"
            onClick={() => handleFilterToggle('distance')}
          >
            Distance
          </button>

          {openFilter === 'distance' && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Distance from campus</label>

                {[
                  { label: 'Any distance', value: 'any' },
                  { label: 'Within 0.5 mi', value: '0.5' },
                  { label: 'Within 1 mi', value: '1' },
                  { label: 'Within 2 mi', value: '2' },
                  { label: 'Within 5 mi', value: '5' },
                ].map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="radio"
                      name="distance"
                      checked={selectedDistance === option.value}
                      onChange={() => onDistanceChange(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-bar-item filter-bar-all-item">
          <button
            type="button"
            className="filter-bar-btn filter-bar-btn-all"
            onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
          >
            All Filters
          </button>
        </div>
      </div>


      <div className="filter-bar-right">
        <label htmlFor="sort-select" className="filter-bar-label">
          Sort by:
        </label>
        <select
          id="sort-select"
          className="filter-bar-select"
          value={sortBy}
          onChange={(event) => handleSortChange(event.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="distance-close-far">Distance: Close to Far</option>
          <option value="distance-far-close">Distance: Far to Close</option>
        </select>
      </div>
    </div>
  );
}
