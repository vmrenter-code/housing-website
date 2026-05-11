import React from 'react';
import './AuthCard.css';

export default function AuthCard({title, subtitle, children}) {
    return (
        <main className="auth-main">
            <div className="auth-card">
                <h2>{title}</h2>
                {subtitle && <p className="subtitle">{subtitle}</p>}
                {children}
            </div>
        </main>
    );
}