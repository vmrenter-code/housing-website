import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import FilterBar from '../../components/FilterBar.js';
import SaveButton from '../../components/SaveButton';
import { API_BASE } from '../../utils.js';
import '../Landing/LandingPage.css';
import './SearchResults.css';

export default function SearchResults() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [searchValue, setSearchValue] = useState(query);
    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [selectedBedrooms, setSelectedBedrooms] = useState([]);
    const [selectedHomeTypes, setSelectedHomeTypes] = useState([]);
    const [selectedDistance, setSelectedDistance] = useState('any');

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const mainRef = useRef(null);
    useEffect(() => { mainRef.current?.focus(); }, []);

    useEffect(() => {
        setSearchValue(query);
    }, [query]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (priceRange.min > 0) params.set('minPrice', priceRange.min);
        if (priceRange.max < 2000) params.set('maxPrice', priceRange.max);
        selectedBedrooms.forEach(b => params.append('bedrooms', b));
        selectedHomeTypes.forEach(t => params.append('housingType', t.toLowerCase()));

        if (selectedDistance !== 'any') {
            params.set('maxDistance', selectedDistance);
        }

        setLoading(true);
        setFetchError(null);

        const token = localStorage.getItem('token');
        fetch(`${API_BASE}/listings?${params.toString()}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(() => {
                setFetchError('Failed to load listings. Please try again.');
                setLoading(false);
            });
    }, [query, priceRange, selectedBedrooms, selectedHomeTypes, selectedDistance]);
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    };

    let displayListings = [...listings];
    if (sortBy === 'price-low-high') displayListings.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high-low') displayListings.sort((a, b) => b.price - a.price);
    else if (sortBy === 'distance-close-far') displayListings.sort((a, b) => a.distanceToCampus - b.distanceToCampus);
    else if (sortBy === 'distance-far-close') displayListings.sort((a, b) => b.distanceToCampus - a.distanceToCampus);

    return (
        <div className="landing">
            <Navbar />

            <main className="landing-main" ref={mainRef} tabIndex={-1} id="main-content">
                <section className="landing-section search-results-section">
                    <form className="search-results-searchbar" onSubmit={handleSearchSubmit}>
                        <input
                            className="search-results-searchbar-input"
                            type="text"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search by university, city, or zip code..."
                            aria-label="Search listings by university, city, or zip code"
                        />
                        <button className="search-results-searchbar-btn" type="submit">
                            Search
                        </button>
                    </form>

                    <FilterBar
                        onSortChange={setSortBy}
                        onPriceChange={setPriceRange}
                        onBedroomsChange={setSelectedBedrooms}
                        onHomeTypeChange={setSelectedHomeTypes}
                        onDistanceChange={setSelectedDistance}
                        priceRange={priceRange}
                        selectedBedrooms={selectedBedrooms}
                        selectedHomeTypes={selectedHomeTypes}
                        selectedDistance={selectedDistance}
                    />

                    <div className="search-results-summary">
                        <h2 className="landing-section-title search-results-summary-title">
                            Results near {query || 'your school'}
                        </h2>
                        <p className="search-results-summary-count" aria-live="polite">
                            {loading ? 'Loading...' : `${displayListings.length} listings found`}
                        </p>
                    </div>

                    {fetchError && (
                        <p role="alert" className="search-error-message">{fetchError}</p>
                    )}

                    <div className="search-results-grid">
                        {displayListings.map((listing) => (
                            <div key={listing._id} className="search-result-card">
                                {listing.imageUrl ? (
                                    <img
                                        src={listing.imageUrl}
                                        alt={listing.title}
                                        className="search-result-card-image"
                                    />
                                ) : (
                                    <div className="search-result-card-image" aria-hidden="true">No Image</div>
                                )}
                                <div className="search-result-card-content">
                                    <h3 className="search-result-card-title">{listing.title}</h3>
                                    <p className="search-result-card-price">${listing.price}/mo</p>
                                    <p className="search-result-card-meta">
                                        {listing.bedrooms} bed • {listing.distanceToCampus} mi from campus
                                    </p>
                                    <button
                                        className="search-result-card-link"
                                        onClick={() => navigate(`/listing/${listing._id}`)}
                                        aria-label={`View details for ${listing.title}`}
                                    >
                                        View Details →
                                    </button>
                                </div>
                                <SaveButton listingId={listing._id} variant="icon" />
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
