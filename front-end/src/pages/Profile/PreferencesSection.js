import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../utils';
import HousingPreferences from '../../components/HousingPreferences';
import NotificationSettings from '../../components/NotificationSettings';

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

export default function PreferencesSection({ user, initialPreferences, initialNotificationSettings }) {
    const [preferences, setPreferences] = useState(initialPreferences || defaultPreferences);
    const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings || defaultNotificationSettings);
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);

    useEffect(() => {
        if (initialPreferences) {
            setPreferences(initialPreferences);
        }
    }, [initialPreferences]);

    useEffect(() => {
        if (initialNotificationSettings) {
            setNotificationSettings(initialNotificationSettings);
        }
    }, [initialNotificationSettings]);

    useEffect(() => {
        if (!user) return;
        if (!preferences) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const timeoutId = setTimeout(() => {
            setIsSavingPreferences(true);
            fetch(`${API_BASE}/users/preferences`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(preferences),
            })
                .then(() => setIsSavingPreferences(false))
                .catch(() => setIsSavingPreferences(false));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [preferences, user]);

    useEffect(() => {
        if (!user) return;
        if (!notificationSettings) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const timeoutId = setTimeout(() => {
            setIsSavingNotifications(true);
            fetch(`${API_BASE}/users/notification`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(notificationSettings),
            })
                .then(() => setIsSavingNotifications(false))
                .catch(() => setIsSavingNotifications(false));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [notificationSettings, user]);

    if (!user) return null;

    return (
        <section className="card preferences-card" id="profile-panel-preferences" role="tabpanel" aria-labelledby="profile-tab-preferences" tabIndex={0}>
            <h2>Housing Preferences</h2>
            <div className="settings-grid">
                <HousingPreferences preferences={preferences} onChange={setPreferences} />
                <NotificationSettings notificationSettings={notificationSettings} onChange={setNotificationSettings} />
            </div>
            <div className="status-row" role="status" aria-live="polite">
                {isSavingPreferences && <p>Saving preferences...</p>}
                {isSavingNotifications && <p>Saving notification settings...</p>}
            </div>
        </section>
    );
}
