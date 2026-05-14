import React from 'react';
import "./ProfileTabs.css"

export default function ProfileTabs({activeTab, onTabClick}) {
    const tabs = ['Account', 'Preferences', 'Notifications', 'Saved Listings'];

    return (
        <nav className="profile-tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={activeTab === tab ? 'active' : ''}
                    onClick={() => onTabClick(tab)}>
                    {tab}
                </button>
            ))}
        </nav>
    );
}