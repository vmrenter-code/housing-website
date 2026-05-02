import React from 'react';
import './Navbar.css';

const NAV_LINKS = ['Browse', 'Map', 'Saved', 'Messages', 'Profile'];

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-logo">UniHousing</span>
      <div className="navbar-links">
        {NAV_LINKS.map((link) => (
          <a key={link} href="#" className="navbar-link">
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}