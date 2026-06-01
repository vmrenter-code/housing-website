const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;



/* --- User Preferences --- */
const preferencesSchema = new Schema({
    budget: { type: Number, default: 1500 },
    bedrooms: { type: String, default: 'Any' },
    maxDistance: { type: String, default: '<1 mi' },
    amenities: { type: [String], default: ['Parking', 'Gym'] },
    leaseDuration: { type: String, default: '12 mo' }
}, { _id: false });


/* --- Notification Settings --- */
const notificationSettingsSchema = new Schema({
    newMatches: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
    applicationUpdates: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: true }
}, { _id: false });


/* --- User Schema --- */
const userSchema = new Schema({
    // General information
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // email => primary key
    password: { type: String, required: true },
    role: { type: String, enum: ['tenant', 'landlord', 'agent', 'admin'], default: 'tenant' },
    university: {
        type: String,
        required: () => { return this.role == 'tenant' },
        trim: true
    },

    // Fields for SSO integration
    googleId: { type: String },
    ssoId: { type: String },

    // Preferences
    preferences: { type: preferencesSchema, default: () => ({}) },

    // Notification Settings
    notificationSettings: { type: notificationSettingsSchema, default: () => ({}) },

}, {
    // Add `createdAt` and `updatedAt` timestamps
    timestamps: true
});


// Hash password automatically before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


// Compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;