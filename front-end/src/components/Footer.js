import React from 'react';
import './Footer.css';

const FOOTER_LINKS = ['About', 'Privacy', 'Contact'];

export default function Footer()
{
    return (
        <footer className = "footer">
            <span> 2026 UniHousing </span>
            {FOOTER_LINKS.map((link) => (
                <button key={link} className="footer-link">
                    {link}
                </button>
        ))}
        </footer>
    )
}