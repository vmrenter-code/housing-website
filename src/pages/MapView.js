import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import listings from '../data/mockListings';
import './MapView.css';

//Fix file name
const markerPositions = [
  { top: '30%', left: '38%' },
  { top: '28%', left: '62%' },
  { top: '55%', left: '50%' },
  { top: '68%', left: '32%' },
  { top: '58%', left: '72%' },
  { top: '72%', left: '56%' },
];

const transitStops = [
  { name: 'Bus Stop A', top: '42%', left: '45%' },
  { name: 'Bus Stop B', top: '63%', left: '66%' },
  { name: 'Metro Station', top: '48%', left: '78%' },
];

export default function MapView() {
  const [searchValue, setSearchValue] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [priceLimit, setPriceLimit] = useState('any');
  const [homeType, setHomeType] = useState('any');
  const [distanceLimit, setDistanceLimit] = useState('any');
  const [showTransit, setShowTransit] = useState(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setLocationQuery(searchValue.trim());
  };

  let filteredListings = [];

  if (locationQuery !== '') {
    filteredListings = listings.filter((listing) =>
      listing.university.toLowerCase().includes(locationQuery.toLowerCase())
    );

    if (priceLimit !== 'any') {
      filteredListings = filteredListings.filter(
        (listing) => listing.priceValue <= Number(priceLimit)
      );
    }

    if (homeType !== 'any') {
      filteredListings = filteredListings.filter(
        (listing) => listing.homeType === homeType
      );
    }

    if (distanceLimit !== 'any') {
      filteredListings = filteredListings.filter(
        (listing) => listing.distanceValue <= Number(distanceLimit)
      );
    }
  }

  return (
    <div className="map-view-page">
      <Navbar />

      <main className="map-view-main">
        <section className="map-toolbar">
          <form className="map-search-form" onSubmit={handleSearchSubmit}>
            <input
              className="map-search-input"
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search address, university, city, or zip code..."
            />

            <button className="map-search-button" type="submit">
              Search
            </button>
          </form>

          <select
            className="map-filter"
            value={priceLimit}
            onChange={(event) => setPriceLimit(event.target.value)}
          >
            <option value="any">Price</option>
            <option value="900">$900 or less</option>
            <option value="1200">$1,200 or less</option>
            <option value="1500">$1,500 or less</option>
          </select>

          <select
            className="map-filter"
            value={homeType}
            onChange={(event) => setHomeType(event.target.value)}
          >
            <option value="any">Housing Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            <option value="House">House</option>
            <option value="Loft">Loft</option>
          </select>

          <select
            className="map-filter"
            value={distanceLimit}
            onChange={(event) => setDistanceLimit(event.target.value)}
          >
            <option value="any">Distance</option>
            <option value="0.5">Within 0.5 mi</option>
            <option value="1">Within 1 mi</option>
            <option value="2">Within 2 mi</option>
          </select>

          <button
            type="button"
            className={`transit-toggle ${showTransit ? 'active' : ''}`}
            onClick={() => setShowTransit(!showTransit)}
          >
            {showTransit ? 'Hide Transit' : 'Show Transit'}
          </button>
        </section>

        <section className="map-content">
          <aside className="map-list-panel">
            <h2>
              {locationQuery
                ? `${filteredListings.length} Listings Near ${locationQuery}`
                : 'Search for a location to view listings'}
            </h2>

            <div className="map-listings">
              {filteredListings.map((listing) => (
                <article key={listing.id} className="map-listing-card">
                  <div className="map-listing-image">IMG</div>

                  <div className="map-listing-body">
                    <h3>{listing.title}</h3>
                    <p className="map-listing-price">{listing.price}</p>
                    <p className="map-listing-meta">
                      {listing.bedrooms} • {listing.distance}
                    </p>
                    <p className="map-listing-transit">
                      12–20 min by bus to campus
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className="mock-map-area">
            {locationQuery && <div className="radius-circle"></div>}

            {locationQuery && (
              <div className="center-marker">
                <span>📍</span>
                <p>{locationQuery} Center</p>
              </div>
            )}

            <div className="map-label">Interactive Map Area</div>

            {filteredListings.map((listing, index) => {
              const position = markerPositions[index % markerPositions.length];

              return (
                <button
                  key={listing.id}
                  className="price-marker"
                  style={{ top: position.top, left: position.left }}
                  title={listing.title}
                >
                  {listing.price.replace('/mo', '')}
                </button>
              );
            })}

            {showTransit && locationQuery && (
              <>
                <div className="transit-route route-one"></div>
                <div className="transit-route route-two"></div>

                {transitStops.map((stop) => (
                  <div
                    key={stop.name}
                    className="transit-stop"
                    style={{ top: stop.top, left: stop.left }}
                    title={stop.name}
                  >
                    🚌
                    <span>{stop.name}</span>
                  </div>
                ))}
              </>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
