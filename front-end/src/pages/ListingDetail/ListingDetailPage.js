import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SaveButton from '../../components/SaveButton';
import listings from '../../data/mockListings';
import './ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const listing = listings.find((item) => item.id === Number(id));

 

  const handleBack = () => {
    navigate(location.state?.from || '/map', {
        state: {
        mapState: location.state?.mapState,
        },
    });
};
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const onSend = () => {
      if (!message.trim()) {
        alert('Please enter a message');
        return;
      }
      const msg = {
        id: Date.now(),
        listingId: listing.id,
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
      // clear inputs and show confirmation
      setMessage('');
      setName('');
      setEmail('');
      setSent(true);
      setTimeout(() => setSent(false), 2000);
    };
  if (!listing) {
    return (
      <div>
        <Navbar />
        <main className="listing-detail-main">
          <h2>Listing not found</h2>
          <button onClick={() => navigate(-1)}>Back to Map</button>
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
            <button className="back-button" onClick={handleBack}>
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

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button className="send-button" onClick={onSend} disabled={sent}>
              {sent ? 'Sent ✓' : 'Send Message'}
            </button>

            <button
              className="apply-button"
              onClick={() => navigate(`/apply/${listing.id}`)}
            >
              Apply Now
            </button>

            <div className="contact-actions">
              <SaveButton listingId={listing.id} />
              <button>Share</button>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}