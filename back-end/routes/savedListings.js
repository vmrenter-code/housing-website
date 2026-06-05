const express = require('express');
const SavedListing = require('../models/SavedListing');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const { serverError, error } = require('../utils/common');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const savedListings = await SavedListing.find({ user: req.user.id })
            .populate('listing')
            .sort({ createdAt: -1 });

        res.json(savedListings);
    } catch (err) {
        serverError(err, res);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { listingId } = req.body;

        if (!listingId) {
            return error(res, 400, 'listingId is required');
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return error(res, 404, 'Listing not found');
        }

        const savedListing = new SavedListing({
            user: req.user.id,
            listing: listingId
        });

        await savedListing.save();
        await savedListing.populate('listing');

        res.status(201).json(savedListing);
    } catch (err) {
        if (err.code === 11000) {
            return error(res, 400, 'Listing is already saved');
        }

        if (err.name === 'ValidationError') {
            return error(res, 400, err.message);
        }

        serverError(err, res);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const savedListing = await SavedListing.findById(req.params.id);

        if (!savedListing) {
            return error(res, 404, 'Saved listing not found');
        }

        if (savedListing.user.toString() !== req.user.id) {
            return error(res, 403, 'Not authorized to delete this saved listing');
        }

        await SavedListing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Saved listing removed successfully' });
    } catch (err) {
        serverError(err, res);
    }
});

router.delete('/listing/:listingId', auth, async (req, res) => {
    try {
        const savedListing = await SavedListing.findOne({
            user: req.user.id,
            listing: req.params.listingId
        });

        if (!savedListing) {
            return error(res, 404, 'Saved listing not found');
        }

        await SavedListing.findByIdAndDelete(savedListing._id);
        res.json({ message: 'Saved listing removed successfully' });
    } catch (err) {
        serverError(err, res);
    }
});

module.exports = router;
