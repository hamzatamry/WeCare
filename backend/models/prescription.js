const mongoose = require('mongoose');

const prescriptionListElement = mongoose.Schema({
    medication: [
        {
            type: String
        }
    ],
    consultationDate: {
        type: Date,
        default: Date.now
    },
    situation: String,
    details: String
}, { _id: false });

const prescriptionSchema = mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    dcId: {
        type: String,
        required: true
    },
    prescriptionList: [prescriptionListElement]
});

module.exports = mongoose.model('Prescription', prescriptionSchema);