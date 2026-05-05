import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import listings from '../data/mockListings';
import './MapView.css';

export default function MapView() {
  const [searchValue, setSearchValue] = useState('UCLA, Los Angeles');

  return (
    <div className="map-view-page">
      <Navbar />

      <main className="map-view-main">
        <section className="map-toolbar">
          <input
            className="map-search-input"
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search address, university, city, or zip code..."
          />

          <select className="map-filter">
            <option>Price</option>
          </select>

          <select className="map-filter">
            <option>Housing Type</option>
          </select>

          <select className="map-filter">
            <option>Distance</option>
          </select>
        </section>

        <section className="map-content">
          <aside className="map-list-panel">
            <h2>{listings.length} Listings Near UCLA</h2>

            <div className="map-listings">
              {listings.slice(0, 4).map((listing) => (
                <article key={listing.id} className="map-listing-card">
                  <div className="map-listing-image">IMG</div>

                  <div className="map-listing-body">
                    <h3>{listing.title}</h3>
                    <p className="map-listing-price">{listing.price}</p>
                    <p className="map-listing-meta">
                      {listing.bedrooms} • {listing.distance}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className="mock-map-area">
            <div className="map-label">Interactive Map Area</div>

            <button className="price-marker marker-one">$1,200</button>
            <button className="price-marker marker-two">$900</button>
            <button className="price-marker marker-three">$850</button>
            <button className="price-marker marker-four">$1,500</button>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}