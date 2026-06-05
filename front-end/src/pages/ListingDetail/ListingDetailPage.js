import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SaveButton from '../../components/SaveButton';
import { API_BASE } from '../../utils.js';
import './ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const mainRef = useRef(null);
  useEffect(() => { mainRef.current?.focus(); }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/listings/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (res.status === 404) throw new Error('not_found');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(err => {
        setFetchError(err.message === 'not_found' ? 'Listing not found.' : 'Failed to load listing.');
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(location.state?.from || '/map', {
      state: { mapState: location.state?.mapState },
    });
  };

  const onSend = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }
    const msg = {
      id: Date.now(),
      listingId: listing._id,
      listingTitle: listing.title,
      sender: 'user',
      name: name || '',
      email: email || '',
      content: message,
      timestamp: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('messages') || '[]');
      existing.push(msg);
      localStorage.setItem('messages', JSON.stringify(existing));
    } catch (e) {
      localStorage.setItem('messages', JSON.stringify([msg]));
    }
    setMessage('');
    setName('');
    setEmail('');
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  if (loading) {
    return (
      <div className="listing-detail-page">
        <Navbar />
        <main className="listing-detail-main" aria-busy="true" tabIndex={-1} id="main-content">
          <p>Loading listing...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="listing-detail-page">
        <Navbar />
        <main className="listing-detail-main" tabIndex={-1} id="main-content">
          <h2>{fetchError}</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="listing-detail-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />

      <main ref={mainRef} tabIndex={-1} id="main-content">
        <section className="photo-grid">
          {listing.imageUrl ? (
            <img src={listing.imageUrl} alt={listing.title} className="main-photo" />
          ) : (
            <div className="main-photo" aria-hidden="true">No Image</div>
          )}
          <div className="small-photo" aria-hidden="true"></div>
          <div className="small-photo" aria-hidden="true"></div>
          <div className="small-photo" aria-hidden="true"></div>
          <div className="small-photo more-photo" aria-hidden="true">+ more</div>
        </section>

        <section className="listing-detail-content">
          <div className="listing-info">
            <button
              className="back-button"
              onClick={handleBack}
              aria-label="Back to previous page"
            >
              ← Back
            </button>

            <h1>{listing.title}</h1>
            <p className="listing-address">
              {listing.address} | {listing.distanceToCampus} mi from campus
            </p>

            <h2 className="listing-price">${listing.price} / month</h2>

            <div className="listing-tags">
              {listing.housingType && (
                <span>{listing.housingType}</span>
              )}
            </div>

            <h3>Description</h3>
            <p className="description-box">{listing.description || 'No description provided.'}</p>

            <h3>Amenities</h3>
            <div className="amenities-grid">
              {(listing.amenities || []).map((amenity) => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>
          </div>

          <aside className="contact-card">
            <h3>
              Contact {listing.landlord?.fullName || 'Agent'}
            </h3>

            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className="send-button"
              onClick={onSend}
              disabled={sent}
              aria-label={sent ? 'Message sent' : 'Send message'}
            >
              {sent ? 'Sent ✓' : 'Send Message'}
            </button>

            <button
              className="apply-button"
              onClick={() => navigate(`/apply/${listing._id}`)}
            >
              Apply Now
            </button>

            <div className="contact-actions">
              <SaveButton listingId={listing._id} />
              <button>Share</button>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
