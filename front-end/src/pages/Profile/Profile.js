import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserHeader from "../../components/UserHeader";
import ProfileTabs from "../../components/ProfileTabs";
import ErrorDialog from "../../components/ErrorDialog";
import AccountSection from "./AccountSection";
import PreferencesSection from "./PreferencesSection";
import MyListingsSection from "./MyListingsSection";
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
    const [activeTab, setActiveTab] = useState('Account');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [initialPreferences, setInitialPreferences] = useState(defaultPreferences);
    const [initialNotificationSettings, setInitialNotificationSettings] = useState(defaultNotificationSettings);

    const allowedTabs = user
        ? user.role === 'student'
            ? ['Account', 'Preferences']
            : ['Account', 'My Listings']
        : ['Account'];

    useEffect(() => {
        if (!user) return;
        if (!allowedTabs.includes(activeTab)) {
            setActiveTab(allowedTabs[0]);
        }
    }, [user, activeTab, allowedTabs]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
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
                setInitialPreferences({ ...defaultPreferences, ...profile.preferences });
                setInitialNotificationSettings({ ...defaultNotificationSettings, ...profile.notificationSettings });
            })
            .catch((err) => {
                setError(err.message || 'Unable to load profile');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

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
                <ProfileTabs tabs={allowedTabs} activeTab={activeTab} onTabClick={handleTabClick} />
                {activeTab === 'Account' && (
                    <AccountSection user={user} setUser={setUser} />
                )}
                {activeTab === 'Preferences' && user?.role === 'student' && (
                    <PreferencesSection
                        user={user}
                        initialPreferences={initialPreferences}
                        initialNotificationSettings={initialNotificationSettings}
                    />
                )}
                {activeTab === 'My Listings' && (
                    <MyListingsSection user={user} />
                )}
            </main>
            <Footer />
        </div>
    );
}
