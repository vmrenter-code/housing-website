const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listingSchema = new Schema(
{
    title: {type: String, required: true, trim: true},
    address: {type: String, required: true, trim: true},
    university: {type: String, required: true, trim: true},
    price: {type: Number, required: true, min: 0},
    bathrooms: {type: Number, required: true, min: 0},
    bedrooms: {type: Number, required: true, min: 0},
    housingType: {type: String, enum: ['apartment', 'house', 'studio', 'shared room', 'other'], default: 'apartment'
    },
    distanceToCampus: {type: Number, required: true, min: 0},
    amenities: { type: [String], default: []},
    imageUrl: {type: String, default: ''},
    landlord: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    isAvailable: {type: Boolean, default: true}
},{timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;