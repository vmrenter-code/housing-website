const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can have the same email
    },
    // The preferences is a nested object
    preferences: {
        budget: {type: Number, default: 1500},
        bedrooms: {type: String, default: '2'},
        maxDistance: {type: String, default: '<1 mi'},
        amenities: {type: [String], default: ['Parking', 'Gym']}
    }
}, {
    // Adds `createdAt` and `updatedAt` fields
    timestamps: true
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);

module.exports = User;