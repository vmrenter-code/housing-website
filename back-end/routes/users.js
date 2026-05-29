const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* --- GET Endpoint: Fetch a user's profile --- */
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email});
        if (!user) {
            // If no user is found, send an error
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

/* --- POST Endpoint: Update user preferences --- */
router.post('/:email/preferences', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            {email: req.params.email}, // Find the user by email
            {preferences: req.body},   // Update their preferences with the request body
            {new: true, upsert: true}  // Options: return the updated doc, and create if not found
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;