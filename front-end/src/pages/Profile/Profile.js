import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserHeader from "../../components/UserHeader";
import ProfileTabs from "../../components/ProfileTabs";
import HousingPreferences from "../../components/HousingPreferences";
import NotificationSettings from "../../components/NotificationSettings";
import "./Profile.css";



export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('Preferences');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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
            })
            .catch((err) => {
                setError(err.message || 'Unable to load profile');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

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
                    <div className="settings-grid">
                        <HousingPreferences />
                        <NotificationSettings />
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
