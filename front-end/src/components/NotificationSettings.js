import React from 'react';
import "./NotificationSettings.css";



const toggleItems = [
    { key: 'newMatches', label: 'New listings matching my filters' },
    { key: 'priceDrops', label: 'Price drops on saved listings' },
    { key: 'newMessages', label: 'Messages from landlords' },
    { key: 'applicationUpdates', label: 'Application status updates' },
    { key: 'weeklyDigest', label: 'Weekly digest email' }
];

function ToggleRow({ label, active, onToggle, id }) {
    return (
        <div className="toggle-row">
            <span>{label}</span>
            <label className="switch" htmlFor={id}>
                <input
                    id={id}
                    type="checkbox"
                    checked={active}
                    onChange={(e) => onToggle(e.target.checked)}
                    aria-checked={active}
                    role="switch"
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
}

export default function NotificationSettings({ notificationSettings, onChange }) {
    if (!notificationSettings) return null;

    return (
        <section className="card">
            <h2>Notification Settings</h2>
            <div className="toggle-list">
                {toggleItems.map(item => (
                    <ToggleRow
                        key={item.key}
                        id={`notification-toggle-${item.key}`}
                        label={item.label}
                        active={notificationSettings[item.key] ?? false}
                        onToggle={(value) => onChange({ ...notificationSettings, [item.key]: value })}
                    />
                ))}
            </div>
        </section>
    );
}
