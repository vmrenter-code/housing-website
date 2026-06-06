import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../utils';
import ErrorDialog from '../../components/ErrorDialog';

const defaultListingForm = {
    title: '',
    description: '',
    address: '',
    university: '',
    price: '',
    bathrooms: '',
    bedrooms: '',
    housingType: 'apartment',
    distanceToCampus: '',
    amenities: '',
    imageUrl: '',
    isAvailable: true,
};

export default function MyListingsSection({ user }) {
    const [managedListings, setManagedListings] = useState([]);
    const [isLoadingListings, setIsLoadingListings] = useState(false);
    const [listingForm, setListingForm] = useState(defaultListingForm);
    const [editingListingId, setEditingListingId] = useState(null);
    const [isSavingListing, setIsSavingListing] = useState(false);
    const [listingMessage, setListingMessage] = useState('');
    const [listingError, setListingError] = useState('');

    const canManageListings = user?.role === 'landlord/agent' || user?.role === 'admin';

    const parseAmenities = (rawAmenities) => rawAmenities
        .split(',')
        .map((amenity) => amenity.trim())
        .filter(Boolean);

    const listingToFormData = (listing) => ({
        title: listing.title || '',
        description: listing.description || '',
        address: listing.address || '',
        university: listing.university || '',
        price: listing.price ?? '',
        bathrooms: listing.bathrooms ?? '',
        bedrooms: listing.bedrooms ?? '',
        housingType: listing.housingType || 'apartment',
        distanceToCampus: listing.distanceToCampus ?? '',
        amenities: Array.isArray(listing.amenities) ? listing.amenities.join(', ') : '',
        imageUrl: listing.imageUrl || '',
        isAvailable: listing.isAvailable !== false,
    });

    const buildListingPayload = () => ({
        title: listingForm.title.trim(),
        description: listingForm.description.trim(),
        address: listingForm.address.trim(),
        university: listingForm.university.trim(),
        price: Number(listingForm.price),
        bathrooms: Number(listingForm.bathrooms),
        bedrooms: Number(listingForm.bedrooms),
        housingType: listingForm.housingType,
        distanceToCampus: Number(listingForm.distanceToCampus),
        amenities: parseAmenities(listingForm.amenities),
        imageUrl: listingForm.imageUrl.trim(),
        isAvailable: Boolean(listingForm.isAvailable),
    });

    useEffect(() => {
        if (!user || !canManageListings) {
            setManagedListings([]);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        setIsLoadingListings(true);
        fetch(`${API_BASE}/listings/mine/all`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || 'Unable to load your listings');
                }
                return res.json();
            })
            .then((data) => {
                setManagedListings(data);
            })
            .catch((err) => {
                setListingError(err.message || 'Unable to load your listings');
            })
            .finally(() => {
                setIsLoadingListings(false);
            });
    }, [user, canManageListings]);

    const resetListingForm = () => {
        setListingForm(defaultListingForm);
        setEditingListingId(null);
    };

    const handleListingInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setListingForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditListing = (listing) => {
        setListingMessage('');
        setListingError('');
        setEditingListingId(listing._id);
        setListingForm(listingToFormData(listing));
    };

    const handleSubmitListing = async (event) => {
        event.preventDefault();
        setListingMessage('');
        setListingError('');

        if (!canManageListings) {
            setListingError('Only landlord/agent accounts can manage listings.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setListingError('Please log in again to continue.');
            return;
        }

        setIsSavingListing(true);

        const endpoint = editingListingId
            ? `${API_BASE}/listings/${editingListingId}`
            : `${API_BASE}/listings`;
        const method = editingListingId ? 'PATCH' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(buildListingPayload()),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to save listing');
            }

            if (editingListingId) {
                setManagedListings((prev) => prev.map((item) => (
                    item._id === data._id ? data : item
                )));
                setListingMessage('Listing updated successfully.');
            } else {
                setManagedListings((prev) => [data, ...prev]);
                setListingMessage('Listing created successfully.');
            }

            resetListingForm();
        } catch (err) {
            setListingError(err.message || 'Unable to save listing');
        } finally {
            setIsSavingListing(false);
        }
    };

    if (!user) return null;

    return (
        <section className="my-listings-panel" id="profile-panel-my-listings" role="tabpanel" aria-labelledby="profile-tab-my-listings" tabIndex={0}>
            {!canManageListings && (
                <section className="card listing-manager-card">
                    <h2>My Listings</h2>
                    <p>Switch your account role to Landlord/Agent to create and edit listings.</p>
                </section>
            )}

            {canManageListings && (
                <section className="card listing-manager-card">
                    <h2>{editingListingId ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <div className="listing-manager-layout">
                        <div className="listing-manager-form-column">
                            <form onSubmit={handleSubmitListing} className="listing-manager-form">
                                <div className="input-group">
                                    <label htmlFor="listing-title">Title</label>
                                    <input id="listing-title" name="title" value={listingForm.title} onChange={handleListingInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-description">Description</label>
                                    <textarea id="listing-description" name="description" value={listingForm.description} onChange={handleListingInputChange} rows={3} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-address">Address</label>
                                    <input id="listing-address" name="address" value={listingForm.address} onChange={handleListingInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-university">University</label>
                                    <input id="listing-university" name="university" value={listingForm.university} onChange={handleListingInputChange} required />
                                </div>
                                <div className="listing-manager-grid">
                                    <div className="input-group">
                                        <label htmlFor="listing-price">Price (Monthly)</label>
                                        <input id="listing-price" name="price" type="number" min="0" step="1" value={listingForm.price} onChange={handleListingInputChange} required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="listing-bathrooms">Bathrooms</label>
                                        <input id="listing-bathrooms" name="bathrooms" type="number" min="0" step="0.5" value={listingForm.bathrooms} onChange={handleListingInputChange} required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="listing-bedrooms">Bedrooms</label>
                                        <input id="listing-bedrooms" name="bedrooms" type="number" min="0" step="1" value={listingForm.bedrooms} onChange={handleListingInputChange} required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="listing-distance">Distance to Campus (mi)</label>
                                        <input id="listing-distance" name="distanceToCampus" type="number" min="0" step="0.1" value={listingForm.distanceToCampus} onChange={handleListingInputChange} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-type">Housing Type</label>
                                    <select id="listing-type" name="housingType" value={listingForm.housingType} onChange={handleListingInputChange}>
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="studio">Studio</option>
                                        <option value="shared room">Shared Room</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-amenities">Amenities (comma separated)</label>
                                    <input id="listing-amenities" name="amenities" value={listingForm.amenities} onChange={handleListingInputChange} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="listing-image">Image URL</label>
                                    <input id="listing-image" name="imageUrl" type="url" value={listingForm.imageUrl} onChange={handleListingInputChange} />
                                </div>
                                <label className="listing-availability-checkbox" htmlFor="listing-available">
                                    <input
                                        id="listing-available"
                                        name="isAvailable"
                                        type="checkbox"
                                        checked={listingForm.isAvailable}
                                        onChange={handleListingInputChange}
                                    />
                                    Listing is available
                                </label>
                                <div className="listing-manager-actions">
                                    <button type="submit" className="save-btn" disabled={isSavingListing}>
                                        {isSavingListing ? 'Saving...' : editingListingId ? 'Update Listing' : 'Create Listing'}
                                    </button>
                                    {editingListingId && (
                                        <button type="button" className="save-btn listing-cancel-btn" onClick={resetListingForm}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>

                            {listingMessage && <p className="form-success">{listingMessage}</p>}
                            <ErrorDialog visible={!!listingError} title="Listing Error" message={listingError} onClose={() => setListingError('')} />
                        </div>

                        <div className="managed-listings managed-listings-column">
                            <h3>Your Listings</h3>
                            {isLoadingListings && <p>Loading your listings...</p>}
                            {!isLoadingListings && managedListings.length === 0 && <p>No listings created yet.</p>}
                            {!isLoadingListings && managedListings.map((listing) => (
                                <article key={listing._id} className="managed-listing-item">
                                    <div>
                                        <h4>{listing.title}</h4>
                                        <p>{listing.address}</p>
                                        <p>${listing.price}/mo • {listing.bedrooms} bed • {listing.bathrooms} bath</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="save-btn"
                                        onClick={() => handleEditListing(listing)}
                                    >
                                        Edit
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </section>
    );
}
