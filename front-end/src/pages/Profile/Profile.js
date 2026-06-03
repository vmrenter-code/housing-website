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

    const prefTimeout = useRef(null);
    const notifTimeout = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
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
                    name: profile.fullName || profile.name || 'No Name',
                    email: profile.email || 'no-email@example.com',
                    school: profile.university || 'no-school',
                    role: profile.role || 'no-role',
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
                    <UserHeader user={user} />
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                </div>
                <ProfileTabs activeTab={activeTab} onTabClick={setActiveTab} />
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
