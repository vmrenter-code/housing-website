import React from 'react'
import "./NotificationSettings.css"


function ToggleRow({label, active}) {
    return (
        <div className="toggle-row">
            <span>{label}</span>
            <label className="switch">
                <input type="checkbox" defaultChecked={active}/>
                <span className="slider round"></span>
            </label>
        </div>
    );
}

export default function NotificationSettings() {
    return (
        <section className="card">
            <h2>Notification Settings</h2>
            <div className="toggle-list">
                <ToggleRow label="New listings matching my filters" active={true}/>
                <ToggleRow label="Price drops on saved listings" active={true}/>
                <ToggleRow label="Messages from landlords" active={true}/>
                <ToggleRow label="Application status updates" active={false}/>
                <ToggleRow label="Weekly digest email" active={true}/>
            </div>
        </section>
    );
}