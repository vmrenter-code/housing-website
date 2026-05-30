const mongoose = require('mongoose');
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
    university: { type: String, required: () => { return this.role == 'tenant' }, trim: true },

    // User role
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'agent', 'admin'],
        default: 'tenant'
    },

    // Fields for SSO integration
    googleId: { type: String },
    ssoId: { type: String },

    // Preferences
    preferences: {
        type: preferencesSchema,
        default: () => ({})
    },

    // Notification Settings
    notificationSettings: {
        type: notificationSettingsSchema,
        default: () => ({})
    },

}, {
    // Add `createdAt` and `updatedAt` timestamps
    timestamps: true
});


const User = mongoose.model('User', userSchema);
module.exports = User;