import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserHeader from "../../components/UserHeader";
import ProfileTabs from "../../components/ProfileTabs";
import HousingPreferences from "../../components/HousingPreferences";
import NotificationSettings from "../../components/NotificationSettings";
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

    const prefTimeout = useRef(null);
    const notifTimeout = useRef(null);

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
                    <p className="form-error">{error}</p>
                    <button className="logout-btn" onClick={handleLogout}>
                        {localStorage.getItem('token') ? 'Log Out' : 'Go to Login'}
                    </button>
                </main>
                <Footer />
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
                    <div className="settings-grid">
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
                                {accountError && <p className="form-error">{accountError}</p>}
                            </form>
                        </section>
                    </div>
                )}
                {activeTab === 'Preferences' && (
                    <>
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
                        <div className="status-row">
                            {isSavingPreferences && <p>Saving preferences...</p>}
                            {isSavingNotifications && <p>Saving notification settings...</p>}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
