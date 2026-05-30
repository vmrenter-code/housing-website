const express = require('express');
const router = express.Router();
const User = require('../models/User');



/* --- Helpers --- */
function serverError(err, res) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}

function userNotFound(res) {
    return res.status(404).json({ message: 'User not found' });
}

/* --- GET: Fetch a user's profile --- */
router.get('/:email', async (req, res) => {
    try {
        // exclude sensitive data from the query
        const user = await User.findOne({ email: req.params.email.toLowerCase() }).select('-password -googleId -ssoId');

        if (!user)
            return userNotFound(res);

        res.json(user);
    } catch (err) {
        serverError(err, res);
    }
});

/* --- PATCH: Update user preferences --- */
router.patch('/:email/preferences', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email.toLowerCase() },
            { $set: { preferences: req.body } },
            { new: true, runValidators: true }
        ).select('preferences');

        if (!updatedUser)
            return userNotFound(res);

        res.json(updatedUser.preferences);
    } catch (err) {
        serverError(err, res);
    }
});

module.exports = router;