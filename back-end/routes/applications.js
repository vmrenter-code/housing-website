const express = require('express');
const Application = require('../models/Application');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { listing, moveInDate, message, phoneNumber } = req.body;

        const targetListing = await Listing.findById(listing);

        if (!targetListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const existingApplication = await Application.findOne({
            applicant: req.user.id,
            listing: listing
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You already applied to this listing' });
        }

        const application = new Application({
            applicant: req.user.id,
            listing,
            moveInDate,
            message,
            phoneNumber
        });

        const savedApplication = await application.save();

        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create application', error: err.message });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('listing')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
});

router.get('/listing/:listingId', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ listing: req.params.listingId })
            .populate('applicant', 'fullName email role')
            .populate('listing')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch listing applications', error: err.message });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id).populate('listing');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.listing.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        const updatedApplication = await application.save();

        res.json(updatedApplication);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update application status', error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicant.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this application' });
        }

        await Application.findByIdAndDelete(req.params.id);

        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete application', error: err.message });
    }
});

module.exports = router;