const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const applicationSchema = new Schema({
    applicant: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    listing: {type: Schema.Types.ObjectId, ref: 'Listing', required: true},
    moveInDate: {type: Date, required: true},
    message: {type: String, trim: true, default: ''},
    phoneNumber: {type: String, trim: true,default: ''},
    status: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'}
}, {timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;