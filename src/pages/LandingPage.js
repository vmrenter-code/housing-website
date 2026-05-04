import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.js';
import Footer from '../components/Footer.js';
import SearchBar from '../components/Searchbar.js';
import UniversityChip from '../components/Universitychip.js';
import FeatureCard from '../components/Featurecard.js';
import { universities, features } from '../data/landingData.js';
import './LandingPage.css';

export default function Landing() {
  const navigate = useNavigate();

    const handleSearch = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
    };

    const handleUniversityClick = (name) => {
    navigate(`/search?query=${encodeURIComponent(name)}`);
    };

    return (
        <div className = "landing"> 
            <Navbar />

            {/* Hero */}
            <section className ="landing-hero">
                <div className ="landing-hero-content">
                    
                    <h1 className = "landing-hero-title" >
                        Find Housing Near Your University
                    </h1>
                    <p className="landing-hero-sub">
                        Verified listings near top universities across the US
                    </p>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </section>   

    {/* Body */}
      <main className="landing-main">
        {/* Popular Universities */}
        <section className="landing-section">
          <h2 className="landing-section-title">Popular Universities</h2>
          <div className="landing-uni-grid">
            {universities.map((uni) => (
              <UniversityChip
                key={uni}
                name={uni}
                onClick={handleUniversityClick}
              />
            ))}
          </div>
        </section>
 
        {/* Why UniHousing */}
        <section className="landing-section">
          <h2 className="landing-section-title">Why UniHousing?</h2>
          <div className="landing-features-grid">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
              />
            ))}
          </div>
        </section>
      </main>
 
      <Footer />
    </div>


    );
}