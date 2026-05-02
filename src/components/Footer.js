import React from 'react';
import './Footer.css';

const FOOTER_LINKS = ['About', 'Privacy', 'Contact'];

export default function Footer()
{
    return (
        <footer className = "footer">
            <span> 2025 UniHousing </span>
            {FOOTER_LINKS.map((link) => ( 
                <a key = {link} href = "#" className="footer-link">
                    {link}
                </a>    
        ))}
        </footer>
    )
}