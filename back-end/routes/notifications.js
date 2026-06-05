const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { serverError, error } = require('../utils/common');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('listing')
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        serverError(err, res);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { recipient, listing, title, message, type } = req.body;

        const notification = await Notification.create({
            recipient,
            listing,
            title,
            message,
            type
        });

        res.status(201).json(notification);
    } catch (err) {
        if (err.name === 'ValidationError')
            return error(res, 400, err.message);

        serverError(err, res);
    }
});

router.patch('/:id/read', auth, async (req, res) => {
    try {
        const { isRead } = req.body;

        const notification = await Notification.findById(req.params.id);

        if (!notification)
            return error(res, 404, 'Notification not found');

        if (notification.recipient.toString() !== req.user.id)
            return error(res, 403, 'Not authorized to update this notification');

        notification.isRead = isRead === true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        serverError(err, res);
    }
});

router.patch('/mark-all-read', auth, async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ updatedCount: result.modifiedCount || result.nModified || 0 });
    } catch (err) {
        serverError(err, res);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification)
            return error(res, 404, 'Notification not found');

        if (notification.recipient.toString() !== req.user.id)
            return error(res, 403, 'Not authorized to delete this notification');

        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        serverError(err, res);
    }
});

module.exports = router;
