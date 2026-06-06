import React from 'react';
import "./ProfileTabs.css"

export default function ProfileTabs({ tabs = ['Account', 'Preferences', 'My Listings'], activeTab, onTabClick }) {
    const handleKeyDown = (event, index) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

        event.preventDefault();
        const nextIndex = event.key === 'ArrowRight'
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length;

        onTabClick(tabs[nextIndex]);
    };

    return (
        <nav className="profile-tabs" role="tablist" aria-label="Profile sections">
            {tabs.map((tab, index) => (
                <button
                    key={tab}
                    id={`profile-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`profile-panel-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                    tabIndex={activeTab === tab ? 0 : -1}
                    className={activeTab === tab ? 'active' : ''}
                    onClick={() => onTabClick(tab)}
                    onKeyDown={(event) => handleKeyDown(event, index)}>
                    {tab}
                </button>
            ))}
        </nav>
    );
}