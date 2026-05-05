import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = ['Browse', 'Map', 'Saved', 'Messages', 'Profile'];

export default function Navbar() {
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    if (link === 'Browse') {
      navigate('/search');
    }
    if (link === 'Map') {
      navigate('/map');
    }
    if (link === 'Profile')
      navigate('/signup');
  };

  return (
    <nav className="navbar">
      <span className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>UniHousing</span>
      <div className="navbar-links">
        {NAV_LINKS.map((link) => (
          <a key={link} href="#" className="navbar-link" onClick={(e) => {
            e.preventDefault();
            handleLinkClick(link);
          }}>
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}