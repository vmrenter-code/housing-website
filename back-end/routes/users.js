const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { serverError, error } = require('../utils/common')
const auth = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'TEMP_KEY';



/* --- POST: Register a new User --- */
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, university } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser)
            return error(res, 400, 'An account with this email already exists');

        // create the new tenant user
        const newUser = new User({
            fullName,
            email,
            password,
            university,
            role: 'tenant'
        });

        await newUser.save();

        // generate a JWT token so they are immediately logged in
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // return user info (excluding password) and the token
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                university: newUser.university
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError')
            return error(res, 400, err.message);

        serverError(err, res);
    }
});

/* --- POST: Login User --- */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return error(res, 401, 'Invalid email or password');

        // check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return error(res, 401, 'Invalid email or password');

        // generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // send back token and user profile details
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                university: user.university,
                preferences: user.preferences,
                notificationSettings: user.notificationSettings
            }
        });

    } catch (err) {
        serverError(err, res);
    }
});

/* --- GET: Fetch a user's profile --- */
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -googleId -ssoId');
        if (!user)
            return error(res, 404, 'User not found!');

        res.json(user);
    } catch (err) {
        serverError(err, res);
    }
});

router.patch('/preferences', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { preferences: req.body } },
            { new: true, runValidators: true }
        ).select('preferences');

        if (!updatedUser)
            return error(res, 404, 'User not found!');

        res.json(updatedUser.preferences);
    } catch (err) {
        serverError(err, res);
    }
});

module.exports = router;