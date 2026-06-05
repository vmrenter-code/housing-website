const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const savedListingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true }
}, {
    timestamps: true
});

savedListingSchema.index({ user: 1, listing: 1 }, { unique: true });

const SavedListing = mongoose.model('SavedListing', savedListingSchema);
module.exports = SavedListing;
