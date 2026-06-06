const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { receiver, content, listingId = '', listingTitle = '' } = req.body;

        if (!receiver || !content || !content.trim()) {
            return res.status(400).json({ error: 'receiver and content are required' });
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver,
            content: content.trim(),
            listingId,
            listingTitle
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'fullName email role')
            .populate('receiver', 'fullName email role');

        const io = req.app.get('io');
        if (io && populatedMessage) {
            const senderRoom = `user:${String(populatedMessage.sender?._id || populatedMessage.sender)}`;
            const receiverRoom = `user:${String(populatedMessage.receiver?._id || populatedMessage.receiver)}`;
            io.to(senderRoom).to(receiverRoom).emit('message:new', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find()
            .where({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] })
            .populate('sender', 'fullName email role')
            .populate('receiver', 'fullName email role')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .populate('sender', 'fullName email role')
            .populate('receiver', 'fullName email role')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.patch('/:id/read', auth, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                error: 'Message not found'
            });
        }

        res.json(message);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                error: 'Message not found'
            });
        }

        res.json({
            message: 'Message deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;