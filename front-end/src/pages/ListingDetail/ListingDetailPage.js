import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import listings from '../../data/mockListings';
import './ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const listing = listings.find((item) => item.id === Number(id));

  if (!listing) {
    return (
      <div>
        <Navbar />
        <main className="listing-detail-main">
          <h2>Listing not found</h2>
          <button onClick={() => navigate('/map')}>Back to Map</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="listing-detail-page">
      <Navbar />

      <main>
        <section className="photo-grid">
          <div className="main-photo">Main Photo</div>
          <div className="small-photo">Photo 2</div>
          <div className="small-photo">Photo 3</div>
          <div className="small-photo">Photo 4</div>
          <div className="small-photo more-photo">+ 8 more</div>
        </section>

        <section className="listing-detail-content">
          <div className="listing-info">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <h1>{listing.title}</h1>
            <p className="listing-address">
              {listing.address} | {listing.distance}
            </p>

            <h2 className="listing-price">{listing.price.replace('/mo', ' / month')}</h2>

            <div className="listing-tags">
              {(listing.tags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <h3>Description</h3>
            <p className="description-box">{listing.description}</p>

            <h3>Amenities</h3>
            <div className="amenities-grid">
              {(listing.amenities || []).map((amenity) => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>
          </div>

          <aside className="contact-card">
            <h3>Contact Agent</h3>

            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
            <textarea placeholder="Message..." />

            <button className="send-button">Send Message</button>

            <div className="contact-actions">
              <button>Save Listing</button>
              <button>Share</button>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}