import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE } from '../../utils.js';
import './MapView.css';

// Fix Leaflet default icon paths broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function RecenterMap({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function MapView() {
    const location = useLocation();

    const restoredState = location.state?.mapState;

    const [searchValue, setSearchValue] = useState(restoredState?.searchValue || '');
    const [locationQuery, setLocationQuery] = useState(restoredState?.locationQuery || '');
    const [priceLimit, setPriceLimit] = useState(restoredState?.priceLimit || 'any');
    const [homeType, setHomeType] = useState(restoredState?.homeType || 'any');
    const [distanceLimit, setDistanceLimit] = useState(restoredState?.distanceLimit || 'any');
    const [showTransit, setShowTransit] = useState(restoredState?.showTransit || false);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([37.0, -119.5]);
    const [activeListingId, setActiveListingId] = useState(null);
    const markerRefs = useRef({});

    const mainRef = useRef(null);
    useEffect(() => { mainRef.current?.focus(); }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (locationQuery) params.set('q', locationQuery);
        if (priceLimit !== 'any') params.set('maxPrice', priceLimit);
        if (homeType !== 'any') params.set('housingType', homeType.toLowerCase());

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
                setFetchError('Failed to load listings.');
                setLoading(false);
            });
    }, [locationQuery, priceLimit, homeType]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setLocationQuery(searchValue.trim());
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserPosition([latitude, longitude]);
                setMapCenter([latitude, longitude]);
            },
            () => {
                alert('Unable to retrieve your location. Please check browser permissions.');
            }
        );
    };

    const getCurrentMapState = () => ({
        searchValue,
        locationQuery,
        priceLimit,
        homeType,
        distanceLimit,
        showTransit,
    });

    let displayListings = distanceLimit !== 'any'
        ? listings.filter(l => l.distanceToCampus <= Number(distanceLimit))
        : [...listings];

    // Sort by closest to campus when a location has been searched
    if (locationQuery || userPosition) {
        displayListings.sort((a, b) => a.distanceToCampus - b.distanceToCampus);
    }

    const mappableListings = displayListings.filter(
        l => l.latitude != null && l.longitude != null
    );

    return (
        <div className="map-view-page">
            <Navbar />

            <main className="map-view-main" ref={mainRef} tabIndex={-1} id="main-content">
                <section className="map-toolbar">
                    <form className="map-search-form" onSubmit={handleSearchSubmit}>
                        <input
                            className="map-search-input"
                            type="text"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search address, university, city, or zip code..."
                            aria-label="Search by location or university"
                        />
                        <button className="map-search-button" type="submit">
                            Search
                        </button>
                    </form>

                    <button
                        type="button"
                        className="map-search-button map-location-button"
                        aria-label="Use my current location to search"
                        onClick={handleUseMyLocation}
                    >
                        Use My Location
                    </button>

                    <select
                        className="map-filter"
                        value={priceLimit}
                        onChange={(event) => setPriceLimit(event.target.value)}
                        aria-label="Filter by price"
                    >
                        <option value="any">Price</option>
                        <option value="900">$900 or less</option>
                        <option value="1200">$1,200 or less</option>
                        <option value="1500">$1,500 or less</option>
                    </select>

                    <select
                        className="map-filter"
                        value={homeType}
                        onChange={(event) => setHomeType(event.target.value)}
                        aria-label="Filter by housing type"
                    >
                        <option value="any">Housing Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="studio">Studio</option>
                        <option value="house">House</option>
                        <option value="other">Other</option>
                    </select>

                    <select
                        className="map-filter"
                        value={distanceLimit}
                        onChange={(event) => setDistanceLimit(event.target.value)}
                        aria-label="Filter by distance"
                    >
                        <option value="any">Distance</option>
                        <option value="0.5">Within 0.5 mi</option>
                        <option value="1">Within 1 mi</option>
                        <option value="2">Within 2 mi</option>
                    </select>

                    <button
                        type="button"
                        className={`transit-toggle ${showTransit ? 'active' : ''}`}
                        onClick={() => setShowTransit(!showTransit)}
                        aria-pressed={showTransit}
                    >
                        {showTransit ? 'Hide Transit' : 'Show Transit'}
                    </button>
                </section>

                {showTransit && (
                    <p className="transit-notice" role="status">
                        Transit overlay coming soon.
                    </p>
                )}

                <section className="map-content">
                    <aside className="map-list-panel">
                        <h2 aria-live="polite">
                            {loading
                                ? 'Loading listings...'
                                : locationQuery
                                    ? `${displayListings.length} listings near ${locationQuery}`
                                    : `${displayListings.length} listings`}
                        </h2>

                        {fetchError && <p role="alert" className="map-error">{fetchError}</p>}

                        <div className="map-listings">
                            {displayListings.map((listing) => (
                                <article
                                    key={listing._id}
                                    className={`map-listing-card ${activeListingId === listing._id ? 'active' : ''}`}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`View ${listing.title} on map, $${listing.price} per month`}
                                    onClick={() => {
                                        setActiveListingId(listing._id);
                                        const marker = markerRefs.current[listing._id];
                                        if (marker) marker.openPopup();
                                        if (listing.latitude && listing.longitude) {
                                            setMapCenter([listing.latitude, listing.longitude]);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveListingId(listing._id);
                                            const marker = markerRefs.current[listing._id];
                                            if (marker) marker.openPopup();
                                            if (listing.latitude && listing.longitude) {
                                                setMapCenter([listing.latitude, listing.longitude]);
                                            }
                                        }
                                    }}
                                >
                                    {listing.imageUrl ? (
                                        <img
                                            src={listing.imageUrl}
                                            alt={listing.title}
                                            className="map-listing-image"
                                        />
                                    ) : (
                                        <div className="map-listing-image" aria-hidden="true"></div>
                                    )}

                                    <div className="map-listing-body">
                                        <h3>{listing.title}</h3>
                                        <p className="map-listing-price">${listing.price}/mo</p>
                                        <p className="map-listing-meta">
                                            {listing.bedrooms} bed • {listing.distanceToCampus} mi from campus
                                        </p>
                                        <Link
                                            to={`/listing/${listing._id}`}
                                            state={{ from: '/map', mapState: getCurrentMapState() }}
                                            className="map-listing-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </aside>

                    <section
                        className="map-area"
                        aria-label="Interactive map showing listing locations"
                    >
                        <MapContainer
                            center={mapCenter}
                            zoom={6}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <RecenterMap center={mapCenter} />

                            {userPosition && (
                                <Marker
                                    position={userPosition}
                                    title="Your location"
                                    alt="Your current location marker"
                                />
                            )}

                            {mappableListings.map((listing) => (
                                <Marker
                                    key={listing._id}
                                    position={[listing.latitude, listing.longitude]}
                                    ref={(ref) => { if (ref) markerRefs.current[listing._id] = ref; }}
                                    title={listing.title}
                                    alt={`Listing marker: ${listing.title}`}
                                    eventHandlers={{
                                        click: () => setActiveListingId(listing._id),
                                    }}
                                >
                                    <Popup>
                                        <div className="map-popup">
                                            <strong>{listing.title}</strong>
                                            <p>${listing.price}/mo · {listing.bedrooms} bed</p>
                                            <p>{listing.address}</p>
                                            <Link
                                                to={`/listing/${listing._id}`}
                                                state={{ from: '/map', mapState: getCurrentMapState() }}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </section>
                </section>
            </main>

            <Footer />
        </div>
    );
}
