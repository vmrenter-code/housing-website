const express = require('express');
const router = express.Router();

const Message = require('../models/Message');

router.post('/', async (req, res) => {
    try {
        const message = await Message.create(req.body);

        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'fullName email')
            .populate('receiver', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;