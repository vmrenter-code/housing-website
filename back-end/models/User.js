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
    fullName: { type: String, required: true, trim: true },
    // email = primary key
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    university: { type: String, required: true, trim: true },


    // Fields for SSO integration
    googleId: { type: String },
    ssoId: { type: String },

    // User Preferences
    preferences: {
        type: preferencesSchema,
        default: () => ({})
    },

    // Notification Settings
    notificationSettings: {
        type: notificationSettingsSchema,
        default: () => ({})
    },

    // References foreign keys from other tables
    savedListings: [{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'Application'
    }],

}, {
    // Add `createdAt` and `updatedAt` timestamps
    timestamps: true
});


const User = mongoose.model('User', userSchema);
module.exports = User;