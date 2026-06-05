import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserHeader from "../../components/UserHeader";
import ProfileTabs from "../../components/ProfileTabs";
import HousingPreferences from "../../components/HousingPreferences";
import NotificationSettings from "../../components/NotificationSettings";
import ErrorDialog from "../../components/ErrorDialog";
import "./Profile.css";



const defaultPreferences = {
    budget: 1500,
    bedrooms: 'Any',
    maxDistance: '<1 mi',
    amenities: ['Parking', 'Gym'],
};

const defaultNotificationSettings = {
    newMatches: true,
    priceDrops: true,
    newMessages: true,
    applicationUpdates: false,
    weeklyDigest: true,
};

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

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState(defaultPreferences);
    const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings);
    const [activeTab, setActiveTab] = useState('Preferences');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [accountMessage, setAccountMessage] = useState('');
    const [accountError, setAccountError] = useState('');
    const [managedListings, setManagedListings] = useState([]);
    const [isLoadingListings, setIsLoadingListings] = useState(false);
    const [listingForm, setListingForm] = useState(defaultListingForm);
    const [editingListingId, setEditingListingId] = useState(null);
    const [isSavingListing, setIsSavingListing] = useState(false);
    const [listingMessage, setListingMessage] = useState('');
    const [listingError, setListingError] = useState('');

    const prefTimeout = useRef(null);
    const notifTimeout = useRef(null);
    const canManageListings = user?.role === 'landlord/agent' || user?.role === 'admin';

    const resetListingForm = () => {
        setListingForm(defaultListingForm);
        setEditingListingId(null);
    };

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleTabClick = (tab) => {
        if (tab === 'Notifications') {
            navigate('/notifications');
            return;
        }

        if (tab === 'Saved Listings') {
            navigate('/saved');
            return;
        }

        setActiveTab(tab);
    };

    const handleAccountSubmit = async (event) => {
        event.preventDefault();
        if (!user) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsSavingAccount(true);
        setAccountMessage('');
        setAccountError('');

        const updatePayload = {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        if (user.role === 'student') {
            updatePayload.university = user.university;
        }

        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to update account information');
            }

            setUser((prev) => ({
                ...prev,
                fullName: data.fullName || prev.fullName,
                email: data.email || prev.email,
                role: data.role || prev.role,
                university: data.university || (data.role === 'student' ? prev.university : ''),
            }));
            setAccountMessage('Account information updated successfully');
        } catch (err) {
            setAccountError(err.message || 'Unable to update account information');
        } finally {
            setIsSavingAccount(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || 'Unable to load profile');
                }
                return res.json();
            })
            .then((profile) => {
                setUser({
                    fullName: profile.fullName || '',
                    email: profile.email || '',
                    role: profile.role || 'student',
                    university: profile.university || '',
                });
                setPreferences({ ...defaultPreferences, ...profile.preferences });
                setNotificationSettings({ ...defaultNotificationSettings, ...profile.notificationSettings });
            })
            .catch((err) => {
                setError(err.message || 'Unable to load profile');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

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

    useEffect(() => {
        if (!user) return;

        if (prefTimeout.current)
            clearTimeout(prefTimeout.current);

        prefTimeout.current = setTimeout(() => {
            const token = localStorage.getItem('token');
            if (!token) return;
            setIsSavingPreferences(true);
            fetch(`${API_BASE}/users/preferences`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(preferences),
            })
                .then((res) => res.json())
                .then(() => {
                    setIsSavingPreferences(false);
                })
                .catch(() => {
                    setIsSavingPreferences(false);
                });
        }, 800);

        return () => {
            if (prefTimeout.current) clearTimeout(prefTimeout.current);
        };
    }, [preferences, user]);

    useEffect(() => {
        if (!user) return;

        if (notifTimeout.current)
            clearTimeout(notifTimeout.current);

        notifTimeout.current = setTimeout(() => {
            const token = localStorage.getItem('token');
            if (!token) return;
            setIsSavingNotifications(true);
            fetch(`${API_BASE}/users/notification`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(notificationSettings),
            })
                .then((res) => res.json())
                .then(() => {
                    setIsSavingNotifications(false);
                })
                .catch(() => {
                    setIsSavingNotifications(false);
                });
        }, 800);

        return () => {
            if (notifTimeout.current) clearTimeout(notifTimeout.current);
        };
    }, [notificationSettings, user]);

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

    if (isLoading) {
        return (
            <div className="profile-page">
                <Navbar />
                <main className="profile-content">
                    <p>Loading profile...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <Navbar />
                <main className="profile-content">
                    <button className="logout-btn" onClick={handleLogout}>
                        {localStorage.getItem('token') ? 'Log Out' : 'Go to Login'}
                    </button>
                </main>
                <Footer />
                <ErrorDialog visible={!!error} message={error} onClose={() => setError("")} />
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />
            <main className="profile-content">
                <div className="profile-header-row">
                    <UserHeader
                        user={{
                            name: user?.fullName || 'No Name',
                            email: user?.email || 'no-email@example.com',
                            school: user?.role === 'student' ? user?.university || 'no-school' : '',
                            role: user?.role || 'no-role',
                        }}
                    />
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                </div>
                <ProfileTabs activeTab={activeTab} onTabClick={handleTabClick} />
                {activeTab === 'Account' && (
                    <div id="profile-panel-0" role="tabpanel" aria-labelledby="profile-tab-0" tabIndex={0} className="settings-grid">
                        <section className="card account-card">
                            <h2>Account Information</h2>
                            <form onSubmit={handleAccountSubmit} className="account-form">
                                <div className="input-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={user?.fullName || ''}
                                        onChange={(e) => setUser((prev) => ({ ...prev, fullName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={user?.email || ''}
                                        onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        value={user?.role || 'student'}
                                        onChange={(e) => setUser((prev) => ({
                                            ...prev,
                                            role: e.target.value,
                                            university: e.target.value === 'student' ? prev?.university || '' : '',
                                        }))}
                                    >
                                        <option value="student">Student</option>
                                        <option value="landlord/agent">Landlord/Agent</option>
                                    </select>
                                </div>
                                {user?.role === 'student' && (
                                    <div className="input-group">
                                        <label htmlFor="university">University</label>
                                        <input
                                            id="university"
                                            type="text"
                                            value={user?.university || ''}
                                            onChange={(e) => setUser((prev) => ({ ...prev, university: e.target.value }))}
                                            required
                                        />
                                    </div>
                                )}
                                <button type="submit" className="save-btn" disabled={isSavingAccount}>
                                    {isSavingAccount ? 'Saving...' : 'Save Account'}
                                </button>
                                {accountMessage && <p className="form-success">{accountMessage}</p>}
                            </form>
                            <ErrorDialog visible={!!accountError} title="Update Error" message={accountError} onClose={() => setAccountError("")} />
                        </section>
                    </div>
                )}
                {activeTab === 'Preferences' && (
                    <section id="profile-panel-1" role="tabpanel" aria-labelledby="profile-tab-1" tabIndex={0}>
                        <div className="settings-grid">
                            <HousingPreferences
                                preferences={preferences}
                                onChange={setPreferences}
                            />
                            <NotificationSettings
                                notificationSettings={notificationSettings}
                                onChange={setNotificationSettings}
                            />
                        </div>
                        <div className="status-row" role="status" aria-live="polite">
                            {isSavingPreferences && <p>Saving preferences...</p>}
                            {isSavingNotifications && <p>Saving notification settings...</p>}
                        </div>
                    </section>
                )}
                {activeTab === 'My Listings' && (
                    <section id="profile-panel-2" role="tabpanel" aria-labelledby="profile-tab-2" tabIndex={0} className="my-listings-panel">
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
                )}
            </main>
            <Footer />
        </div>
    );
}
