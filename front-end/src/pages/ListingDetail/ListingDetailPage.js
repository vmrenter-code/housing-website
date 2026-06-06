import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SaveButton from '../../components/SaveButton';
import { API_BASE, readOfflineCache, writeOfflineCache } from '../../utils.js';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import './ListingDetailPage.css';
import ShareButton from '../../components/ShareButton';

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
  const online = useOnlineStatus();

  const mainRef = useRef(null);
  useEffect(() => { mainRef.current?.focus(); }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cachedListing = readOfflineCache(`offlineListing:${id}`);

    if (!online && cachedListing) {
      setListing(cachedListing);
      setLoading(false);
      return;
    }

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
        writeOfflineCache(`offlineListing:${id}`, data);
        setLoading(false);
      })
      .catch(err => {
        if (cachedListing) {
          setListing(cachedListing);
          setFetchError('Unable to refresh listing, showing cached data.');
        } else {
          setFetchError(err.message === 'not_found' ? 'Listing not found.' : 'Failed to load listing.');
        }
        setLoading(false);
      });
  }, [id, online]);

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
    if (!online) {
      alert('Offline mode: message cannot be sent until you reconnect.');
      return;
    }
    const token = localStorage.getItem('token');
    const receiverId = listing.landlord?._id;

    if (!token || !receiverId) {
      alert('Please log in to send a message.');
      return;
    }

    fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: receiverId,
        content: message,
        listingId: listing._id,
        listingTitle: listing.title,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || 'Unable to send message');
        }

        setMessage('');
        setName('');
        setEmail('');
        setSent(true);
        setTimeout(() => setSent(false), 2000);
      })
      .catch(() => {
        alert('Unable to send message. Please try again.');
      });
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

            {!online && (
              <p className="offline-info">Offline mode: messages cannot be sent until you reconnect.</p>
            )}
            <button
              className="send-button"
              onClick={onSend}
              disabled={sent || !online}
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
              <ShareButton listing={listing} />
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
