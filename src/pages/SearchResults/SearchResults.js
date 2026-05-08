import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import FilterBar from '../../components/FilterBar.js';
import '../Landing/LandingPage.css';
import './SearchResults.css';
import listings from '../../data/mockListings.js';

export default function SearchResults() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [searchValue, setSearchValue] = useState(query);
    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [selectedBedrooms, setSelectedBedrooms] = useState([]);
    const [selectedHomeTypes, setSelectedHomeTypes] = useState([]);
    const normalizedQuery = query.trim().toLowerCase();

    useEffect(() => {
        setSearchValue(query);
    }, [query]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };

    const handlePriceChange = (newPriceRange) => {
        setPriceRange(newPriceRange);
    };

    const handleBedroomsChange = (newBedrooms) => {
        setSelectedBedrooms(newBedrooms);
    };

    const handleHomeTypeChange = (newHomeTypes) => {
        setSelectedHomeTypes(newHomeTypes);
    };

    let filteredListings = listings.filter((listing) => {
        if (!normalizedQuery) {
            return true;
        }

        return listing.university.toLowerCase().includes(normalizedQuery);
    });

    // Apply price filter
    filteredListings = filteredListings.filter(
        (listing) => listing.priceValue >= priceRange.min && listing.priceValue <= priceRange.max
    );

    // Apply bedrooms filter
    if (selectedBedrooms.length > 0) {
        filteredListings = filteredListings.filter((listing) =>
            selectedBedrooms.includes(listing.bedroomValue)
        );
    }

    // Apply home type filter
    if (selectedHomeTypes.length > 0) {
        filteredListings = filteredListings.filter((listing) =>
            selectedHomeTypes.includes(listing.homeType)
        );
    }

    // Apply sorting
    if (sortBy === 'price-low-high') {
        filteredListings = [...filteredListings].sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === 'price-high-low') {
        filteredListings = [...filteredListings].sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === 'distance-close-far') {
        filteredListings = [...filteredListings].sort((a, b) => a.distanceValue - b.distanceValue);
    } else if (sortBy === 'distance-far-close') {
        filteredListings = [...filteredListings].sort((a, b) => b.distanceValue - a.distanceValue);
    }

    return (
        <div className="landing">
            <Navbar />
            
            <main className="landing-main">
                <section className="landing-section search-results-section">
                    <form className="search-results-searchbar" onSubmit={handleSearchSubmit}>
                        <input
                            className="search-results-searchbar-input"
                            type="text"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search by university, city, or zip code..."
                        />
                        <button className="search-results-searchbar-btn" type="submit">
                            Search
                        </button>
                    </form>

                    <FilterBar
                        onSortChange={handleSortChange}
                        onPriceChange={handlePriceChange}
                        onBedroomsChange={handleBedroomsChange}
                        onHomeTypeChange={handleHomeTypeChange}
                        priceRange={priceRange}
                        selectedBedrooms={selectedBedrooms}
                        selectedHomeTypes={selectedHomeTypes}
                    />

                    <div className="search-results-summary">
                        <h2 className="landing-section-title search-results-summary-title">
                            Results near {query || 'your school'}
                        </h2>
                        <p className="search-results-summary-count">
                            {filteredListings.length} listings found
                        </p>
                    </div>

                    <div className="search-results-grid">
                        {filteredListings.map((listing) => (
                            <div key={listing.id} className="search-result-card">
                                <div className="search-result-card-image">Image</div>
                                <div className="search-result-card-content">
                                    <h3 className="search-result-card-title">{listing.title}</h3>
                                    <p className="search-result-card-price">{listing.price}</p>
                                    <p className="search-result-card-meta">
                                        {listing.bedrooms} • {listing.distance}
                                    </p>
                                    <a href="#" className="search-result-card-link">
                                        View Details →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}
