const mongoose = require('mongoose');

const patientListElement = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const dcSchema = mongoose.Schema({
    resetCode: {
        type: String
    },
    role: {
        type: String,
        enum: ['doctor', 'coach'],
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    verified: {
        value: {
            type: Boolean,
            default: false
        },
        code: {
            type: String
        },
        resendTimeout: {
            type: Date,
            default: Date.now
        }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    profile: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        birthday: {
            type: String
        },
        specialty: {
            type: String,
            enum: [
                "Addictologist",
                "Allergist",
                "Anatomist",
                "Anesthetist",
                "Cardiologist",
                "Clinician",
                "Dentist",
                "Dermatologist",
                "Endocrinologist",
                "Forensic scientist",
                "Generalist",
                "Geneticist",
                "Gynecologist",
                "Hematologist",
                "Hepato-gastroenterologist",
                "Homeopath",
                "Immunologist",
                "Medical biologist",
                "Nephrologist",
                "Neurologist",
                "Obstetrician",
                "Oncologist",
                "Ophthalmologist",
                "Orthopedist",
                "Otolaryngologist",
                "Parasitologist",
                "Pathologist",
                "Pediatrician",
                "Proctologist",
                "Psychiatrist",
                "Public health",
                "Pulmonologist",
                "Radiologist",
                "Rheumatologist",
                "Surgeon",
                "Toxicologist",
                "Urologist",
                "Venerologist",
                "Veterinary",
                "Virologist",
                "Athletic",
                "Mental",
                "Nutritional",
                "Other"
            ]
        }, 
        sex: {
            type: String,
            enum:['m', 'f']
        },        
        phoneNumber: {
            type: String
        },
        country: {
            type: String
        },
        imagePath: {
            type: String
        },
        set: {
            type: Boolean,
            default: false
        }
    },
    details: { 
        type: String
    },
    notification: {
        preferredTime: Date,
        notificationList: [
            { 
                message: String,
                sent: { type: Boolean, default: false }
            }
        ]
    },
    geolocation: {
        lat: Number,
        lng: Number,
        address: String,
        staticMapImageUrl: String
    },
    patientList: [patientListElement],
    createdAt: {
        type: Date,
        expires: 7200,
        default: Date.now
    }
});

module.exports = mongoose.model('DC', dcSchema);
