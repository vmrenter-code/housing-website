import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = ['Browse', 'Map', 'Saved', 'Messages', 'Profile'];

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (link) => {
    if (link === 'Browse') {
      navigate('/search');
    }
    if (link === 'Map') {
      navigate('/map');
    }
    if (link === 'Saved') {
      navigate('/saved');
    }
    if (link === 'Messages') {
      navigate('/messages');
    }
    if (link === 'Profile') {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
    }
  };

  const handleHomeClick = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-logo" onClick={() => navigate('/')}>UniHousing</span>
          <button className="navbar-home" onClick={handleHomeClick}>Home</button>
        </div>

        <div className="navbar-right">
          <div className="navbar-links">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="navbar-link"
                onClick={() => handleLinkClick(link)}
              >
                {link}
              </button>
            ))}
          </div>

          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="navbar-dropdown">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className="navbar-link dropdown-link"
              onClick={() => {
                handleLinkClick(link);
                setIsMenuOpen(false);
              }}
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </>
  );
}