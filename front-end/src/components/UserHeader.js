import React from 'react';
import "./UserHeader.css"


export default function UserHeader({user}) {
    return (
        <section className="user-header">
            <div className="avatar-placeholder"></div>
            <div className="user-info">
                <h1>{user.name}</h1>
                <p>{user.email} | {user.school}</p>
                <button className="edit-btn">Edit Profile</button>
            </div>
        </section>
    );
}