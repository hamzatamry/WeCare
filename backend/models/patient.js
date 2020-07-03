const mongoose = require('mongoose');

const dcListElement = mongoose.Schema({
    dc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DC'
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

const patientSchema = mongoose.Schema({
    resetCode: {
        type: String
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
        sex: {
            type: String,
            enum: ['m', 'f']
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
    physicalData: {
        weight: {
            type: Number, 
            min: 0
        },
        height: {
            type: Number, 
            min: 0
        }
    },
    medicalData: {
        illnesses: [
            { type: String }
        ],
        disabilities: [
            { type: String }
        ],
        bloodType: {
            type: String,
            enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']
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
    sensorData: {
        temperature: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        bloodPressure: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        heartbeat: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        glucose: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        steps: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        oxygen: {
            state: {
                type: Boolean,
                default: true
            },
            values: {
                type: mongoose.Schema.Types.Mixed,
                default: [[], [], [], [], [], [], []]
            }
        },
        dates: {
            type: mongoose.Schema.Types.Mixed,
            default: [[], [], [], [], [], [], []]
        },
        lastSampleServerTime: {
            type: Date,
            required: true,
            default: () => new Date(+new Date() - 4*3600*1000)
        },
        waitTime: {
            type: Number,
            required: true,
            default: 4
        }
    },
    calculatedData: {
        bmi: Number
    },
    dcList: [ dcListElement ],
    createdAt: {
        type: Date,
        expires: 7200,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', patientSchema);
