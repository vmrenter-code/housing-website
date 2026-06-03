const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

/* GET all listings */
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('landlord', 'fullName email role')
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
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
        const listing = new Listing({
            ...req.body,
            landlord: req.user.id
        });

        const savedListing = await listing.save();

        res.status(201).json(savedListing);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create listing', error: err.message });
    }
});

/* UPDATE listing */
router.patch('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
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