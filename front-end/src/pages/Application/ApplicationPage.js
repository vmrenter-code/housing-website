import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './ApplicationPage.css';
import { API_BASE } from '../../utils.js';

export default function ApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
const [loading, setLoading] = useState(true);
const [fetchError, setFetchError] = useState(null);

useEffect(() => {
  const token = localStorage.getItem('token');

  fetch(`${API_BASE}/listings/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then((res) => {
      if (res.status === 404) throw new Error('Listing not found');
      if (!res.ok) throw new Error('Failed to load listing');
      return res.json();
    })
    .then((data) => {
      setListing(data);
      setLoading(false);
    })
    .catch((err) => {
      setFetchError(err.message);
      setLoading(false);
    });
}, [id]);
  const [leaseDuration, setLeaseDuration] = useState('12 mo');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentAddress: '',
    cityStateZip: '',
    moveInDate: '',
    specialRequests: '',
  });

  const [documents, setDocuments] = useState({
    governmentId: null,
    proofOfIncome: null,
    creditReport: null,
  });

const handleInputChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleDocumentUpload = (field, file) => {
  if (!file) return;

  setDocuments((prev) => ({
    ...prev,
    [field]: file.name,
  }));
};

const handleSaveLater = () => {
  const draft = {
    listingId: listing._id,
    listingTitle: listing.title,
    leaseDuration,
    formData,
    documents,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(`applicationDraft:${listing._id}`, JSON.stringify(draft));
  alert('Application saved. You can continue later.');
};

const handleSubmitApplication = () => {
  if (!formData.firstName || !formData.lastName || !formData.email) {
    alert('Please complete your first name, last name, and email before submitting.');
    return;
  }

  const application = {
    listingId: listing._id,
    listingTitle: listing.title,
    leaseDuration,
    formData,
    documents,
    submittedAt: new Date().toISOString(),
  };

  localStorage.setItem(`submittedApplication:${listing._id}`, JSON.stringify(application));
  localStorage.removeItem(`applicationDraft:${listing._id}`);

  alert('Application submitted successfully!');
  navigate(`/listing/${listing._id}`);
};

if (loading) {
  return (
    <div>
      <Navbar />
      <main className="application-main">
        <p>Loading application...</p>
      </main>
      <Footer />
    </div>
  );
}

if (fetchError || !listing) {
  return (
    <div>
      <Navbar />
      <main className="application-main">
        <h2>{fetchError || 'Listing not found'}</h2>
        <button onClick={() => navigate(-1)}>← Back</button>
      </main>
      <Footer />
    </div>
  );
}

  return (
    <div className="application-page">
      <Navbar />

      <main className="application-main">
        <section className="application-progress">
        <div className="progress-step active">✓</div>
        <div className="progress-line active"></div>
        <div className="progress-step current">2</div>
        <div className="progress-line"></div>
        <div className="progress-step">3</div>
        <div className="progress-line"></div>
        <div className="progress-step">4</div>
        </section>

        <div className="progress-labels">
          <span>Select Listing</span>
          <span>Contact Info</span>
          <span>Documents</span>
          <span>Review & Submit</span>
        </div>

        <section className="application-layout">
          <aside className="application-listing-card">
            <h3>Applying For</h3>

            <div className="application-listing-image">Listing Image</div>

            <h2>{listing.title}</h2>
            <p className="application-address">
              {listing.address} | {listing.distanceToCampus} mi from campus
            </p>

            <h2 className="application-price">
              ${listing.price} / month
            </h2>

            <div className="application-tags">
              {[listing.housingType, ...(listing.amenities || [])].filter(Boolean).slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <label>Move-in Date</label>
              <input
                type="date"
                value={formData.moveInDate}
                onChange={(e) => handleInputChange('moveInDate', e.target.value)}
              />
            <label>Lease Duration</label>
            <div className="lease-options">
              {['6 mo', '12 mo', 'Month-to-Month'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={leaseDuration === option ? 'selected' : ''}
                  onClick={() => setLeaseDuration(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <label>Special Requests</label>
              <input
                type="text"
                placeholder="Any special requirements..."
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              />          
            </aside>

          <section className="application-form-card">
            <h3>Your Information</h3>

            <div className="form-grid">
              <label>
                First Name
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </label>

              <label>
                Current Address
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                />
              </label>

              <label>
                City, State, ZIP
                <input
                  type="text"
                  value={formData.cityStateZip}
                  onChange={(e) => handleInputChange('cityStateZip', e.target.value)}
                />
              </label>
            </div>

            <h3 className="documents-title">Documents</h3>

            <div className="document-row">
              <span>
                Government-issued ID - Upload PDF or Image
                {documents.governmentId && <small> Uploaded: {documents.governmentId}</small>}
              </span>
              <label className="upload-button">
                Upload
                <input
                  type="file"
                  accept=".pdf,image/*"
                  hidden
                  onChange={(e) => handleDocumentUpload('governmentId', e.target.files[0])}
                />
              </label>
            </div>

            <div className="document-row">
              <span>
                Proof of Income - Upload PDF
                {documents.proofOfIncome && <small> Uploaded: {documents.proofOfIncome}</small>}
              </span>
              <label className="upload-button">
                Upload
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => handleDocumentUpload('proofOfIncome', e.target.files[0])}
                />
              </label>
            </div>

            <div className="document-row">
              <span>
                Credit Report (optional) - Upload PDF
                {documents.creditReport && <small> Uploaded: {documents.creditReport}</small>}
              </span>
              <label className="upload-button">
                Upload
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => handleDocumentUpload('creditReport', e.target.files[0])}
                />
              </label>
            </div>

            <p className="application-note">
              By submitting you agree to our Terms of Service and Privacy Policy.
            </p>

            <div className="application-actions">
              <button type="button" onClick={() => navigate(-1)}>
                ← Back
              </button>

              <button
                type="button"
                className="submit-application-button"
                onClick={handleSubmitApplication}
              >
                Submit Application →
              </button>

              <button type="button" onClick={handleSaveLater}>
                Save & Continue Later
              </button> 
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}