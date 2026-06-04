import React from 'react';
import "./UserHeader.css"



export default function UserHeader({ user }) {
    const getRoleLabel = (role) => {
        switch (role) {
            case 'student':
                return 'Student/Tenant';
            case 'landlord/agent':
                return 'Landlord/Agent';
            case 'admin':
                return 'Admin';
            default:
                return '';
        }
    };

    return (
        <section className="user-header">
            <div className="avatar-placeholder"></div>
            <div className="user-info">
                <h1>{user.name}</h1>
                <div className="user-meta">
                    <span>{user.email}</span>
                    {user.school && <span> | {user.school}</span>}
                    {user.role && <span className="user-role"> | {getRoleLabel(user.role)}</span>}
                </div>
            </div>
        </section>
    );
}