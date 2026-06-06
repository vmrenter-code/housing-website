const express = require('express');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

function hasValidCoordinates(latitude, longitude) {
    return Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
}

async function geocodeAddress(address) {
    if (!address || !address.trim()) return null;

    try {
        const query = encodeURIComponent(address.trim());
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`, {
            headers: {
                'User-Agent': 'UniHousing/1.0 (listing-geocoder)',
                'Accept-Language': 'en'
            }
        });

        if (!response.ok) return null;

        const results = await response.json();
        if (!Array.isArray(results) || !results.length) return null;

        const latitude = Number(results[0].lat);
        const longitude = Number(results[0].lon);

        if (!hasValidCoordinates(latitude, longitude)) return null;

        return { latitude, longitude };
    } catch (err) {
        return null;
    }
}

function canManageListings(user) {
    return user && (user.role === 'landlord/agent' || user.role === 'admin');
}

function parseDistancePreference(pref) {
    if (!pref || pref === 'Any') return Number.MAX_SAFE_INTEGER;
    if (pref.includes('<1')) return 1;
    if (pref.includes('1-3')) return 3;
    if (pref.includes('3-5')) return 5;
    if (pref.includes('5+')) return Number.MAX_SAFE_INTEGER;
    const numeric = Number(pref.replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function matchesListing(listing, user) {
    const prefs = user.preferences || {};
    const budgetMatch = listing.price <= (prefs.budget ?? Number.MAX_SAFE_INTEGER);
    const bedroomMatch = prefs.bedrooms && prefs.bedrooms !== 'Any'
        ? listing.bedrooms >= Number(prefs.bedrooms)
        : true;
    const universityMatch = user.university
        ? listing.university === user.university
        : true;
    const distanceMax = parseDistancePreference(prefs.maxDistance);
    const distanceMatch = listing.distanceToCampus <= distanceMax;
    const amenitiesMatch = Array.isArray(prefs.amenities) && prefs.amenities.length > 0
        ? prefs.amenities.every(amenity => listing.amenities.includes(amenity))
        : true;

    return budgetMatch && bedroomMatch && universityMatch && distanceMatch && amenitiesMatch;
}

async function createMatchNotifications(listing) {
    const users = await User.find({
        role: 'student',
        'notificationSettings.newMatches': true
    });

    const matchedUsers = users.filter(user => matchesListing(listing, user));

    if (!matchedUsers.length) return;

    const notifications = matchedUsers.map(user => ({
        recipient: user._id,
        listing: listing._id,
        title: 'New listing match found',
        message: `A new listing titled \"${listing.title}\" matches your preferences.`,
        type: 'new-match'
    }));

    await Notification.insertMany(notifications);
}

/* GET all listings (supports query params: q, minPrice, maxPrice, bedrooms, housingType, university) */
router.get('/', async (req, res) => {
    try {
        const { q, minPrice, maxPrice, bedrooms, housingType, university, maxDistance } = req.query;        const filter = {};

        if (q) {
            const regex = new RegExp(q.trim(), 'i');
            filter.$or = [
                { title: regex },
                { address: regex },
                { university: regex }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }

        if (bedrooms !== undefined) {
            filter.bedrooms = Number(bedrooms);
        }

        if (housingType) {
            filter.housingType = housingType;
        }

        if (university) {
            filter.university = new RegExp(university.trim(), 'i');
        }

        if (maxDistance !== undefined) {
            filter.distanceToCampus = { $lte: Number(maxDistance) };
        }

        const listings = await Listing.find(filter)
            .populate('landlord', 'fullName email role')
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
    }
});

/* GET current user's listings */
router.get('/mine/all', auth, async (req, res) => {
    try {
        if (!canManageListings(req.user)) {
            return res.status(403).json({ message: 'Only landlords/agents can manage listings' });
        }

        const filter = req.user.role === 'admin' ? {} : { landlord: req.user.id };
        const listings = await Listing.find(filter)
            .populate('landlord', 'fullName email role')
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your listings', error: err.message });
    }
});

/* GET one listing by id */
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('landlord', 'fullName email role');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch listing', error: err.message });
    }
});

/* CREATE listing */
router.post('/', auth, async (req, res) => {
    try {
        if (!canManageListings(req.user)) {
            return res.status(403).json({ message: 'Only landlords/agents can create listings' });
        }

        const listingPayload = {
            ...req.body,
            landlord: req.user.id
        };

        if (!hasValidCoordinates(listingPayload.latitude, listingPayload.longitude)) {
            const coords = await geocodeAddress(listingPayload.address);
            if (coords) {
                listingPayload.latitude = coords.latitude;
                listingPayload.longitude = coords.longitude;
            }
        }

        const listing = new Listing(listingPayload);

        const savedListing = await listing.save();
        await createMatchNotifications(savedListing);

        res.status(201).json(savedListing);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create listing', error: err.message });
    }
});

/* UPDATE listing */
router.patch('/:id', auth, async (req, res) => {
    try {
        if (!canManageListings(req.user)) {
            return res.status(403).json({ message: 'Only landlords/agents can update listings' });
        }

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        const updates = { ...req.body };
        const nextAddress = updates.address !== undefined ? updates.address : listing.address;
        const nextLatitude = updates.latitude !== undefined ? updates.latitude : listing.latitude;
        const nextLongitude = updates.longitude !== undefined ? updates.longitude : listing.longitude;

        if (!hasValidCoordinates(nextLatitude, nextLongitude)) {
            const coords = await geocodeAddress(nextAddress);
            if (coords) {
                updates.latitude = coords.latitude;
                updates.longitude = coords.longitude;
            }
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json(updatedListing);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update listing', error: err.message });
    }
});

/* DELETE listing */
router.delete('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        await Listing.findByIdAndDelete(req.params.id);

        res.json({ message: 'Listing deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete listing', error: err.message });
    }
});

module.exports = router;