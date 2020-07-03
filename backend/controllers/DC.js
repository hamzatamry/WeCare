const DC = require('../models/DC');
const Patient = require('../models/patient');
const Prescription = require('../models/prescription');
const request = require('request');

const sendNotification = (receiverIdList, header, content) => {
    request.post({
        url: 'https://onesignal.com/api/v1/notifications',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + process.env.ONESIGNAL_REST_KEY
        },
        body: {
            'app_id': process.env.APP_ID,
            'include_external_user_ids': receiverIdList,
            'headings': { en: header },
            'contents': { en: content }
        }
    }, (err, res, body) => {
        if (err) {
            console.log(err);
        }
    });
}

exports.getProfile = (req, res, next) => {
    const response = res;
    DC.findById(req.params.id, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        response.status(200).json({
            message: 'Profile fetched successfully!',
            role: res.role,
            firstName: res.profile.firstName,
            lastName: res.profile.lastName,
            birthday: res.profile.birthday,
            specialty: res.profile.specialty,
            sex: res.profile.sex,
            phoneNumber: res.profile.phoneNumber,
            country: res.profile.country,
            address: res.geolocation.address,
            staticMapImageUrl: res.geolocation.staticMapImageUrl,
            imagePath: res.profile.imagePath,
            details: res.details,
            lat: res.geolocation.lat,
            lng: res.geolocation.lng
        });
    });
}

exports.getPatientList = (req, res, next) => {
    const response = res;
    DC.findById(req.params.id).populate({
        path: 'patientList.patient',
        select: [ 'profile.firstName', 'profile.lastName', 'profile.birthday', 'profile.sex', 'email', 'profile.phoneNumber', 'geolocation.address', 'profile.imagePath' ]
    }).then(document => {
        if (!document) {
            return response.status(401).json({
                message: 'Something went wrong. Please try again later...'
            });
        }
        let patientList = [];
        document.patientList.forEach(element => {
            if (!element.deleted) {
                if (!element.confirmed) {
                    // element.patient._id = null;
                    element.patient.profile.sex = undefined;
                    element.patient.email = undefined;
                    element.patient.geolocation = undefined;
                }
                patientList.push(element);
            }
        });
        response.status(200).json({
            message: 'Patient list fetched successfully!',
            patientList: patientList
        });
    })
}

exports.getSensorData = (req, res, next) => {
    const response = res;
    DC.findById(req.params.id).populate({
        path: 'patientList.patient',
        match: { _id: req.params.patientId },
        select: ['sensorData']
    }).then(document => {
        if (!document || !document.patientList) {
            return response.status(401).json({
                message: 'Something went wrong. Please try again later...'
            });
        }
        const foundElement = document.patientList.find(element => {
            return element.patient && element.patient._id == req.params.patientId
        });
        if (!foundElement.confirmed || foundElement.deleted) {
            return response.status(401).json({
                message: 'Patient request is not confirmed yet or has been flagged as deleted...'
            });
        }
        response.status(200).json({
            message: 'Sensor data fetched successfully!',
            sensorData: foundElement.patient.sensorData
        });
    });
}

exports.getOtherData = (req, res, next) => {
    const response = res;
    DC.findById(req.params.id).populate({
        path: 'patientList.patient',
        match: { _id: req.params.patientId },
        select: ['physicalData', 'medicalData', 'details']
    }).then(document => {
        if (!document || !document.patientList) {
            return response.status(401).json({
                message: 'Something went wrong. Please try again later...'
            });
        }
        const foundElement = document.patientList.find(element => {
            return element.patient && element.patient._id == req.params.patientId
        });
        if (!foundElement.confirmed || foundElement.deleted) {
            return response.status(401).json({
                message: 'Patient request is not confirmed yet or has been flagged as deleted...'
            });
        }
        response.status(200).json({
            message: 'Data fetched successfully!',
            physicalData: foundElement.patient.physicalData,
            medicalData: foundElement.patient.medicalData,
            details: foundElement.patient.details
        });
    });
}

exports.getPrescriptionList = async (req, res, next) => {
    const foundPrescription = await Prescription.findOne({ dcId: req.params.id, patientId: req.params.otherId });
    if (foundPrescription) {
        res.status(200).json({
            message: 'Prescription list fetched successfully!',
            prescriptionId: foundPrescription.id,
            prescriptionList: foundPrescription.prescriptionList
        });
    }
    else {
        res.status(400).json({
            message: 'Failed to fetch the desired prescription...'
        });
    }
}

exports.saveProfile = (req, res, next) => {
    const response = res;
    const userId = req.body.id;
    DC.findById(userId, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        const { firstName, lastName, birthday, sex, phoneNumber, specialty, country, address, lat, lng, staticMapImageUrl } = { firstName: req.body.profile.firstName, lastName: req.body.profile.lastName, birthday: req.body.profile.birthday, sex: req.body.profile.sex, phoneNumber: req.body.profile.phoneNumber, specialty: req.body.profile.specialty, country: req.body.profile.country, address: req.body.profile.address, lat: req.body.profile.lat, lng: req.body.profile.lng, staticMapImageUrl: req.body.profile.staticMapImageUrl };
        res.createdAt = undefined;
        res.profile.firstName = firstName;
        res.profile.lastName = lastName;
        res.profile.birthday = birthday;
        res.profile.sex = sex;
        res.profile.phoneNumber = phoneNumber;
        res.profile.specialty = specialty;
        res.profile.country = country;
        res.geolocation.address = address;
        if (lat)
            res.geolocation.lat = lat;
        if (lng)
            res.geolocation.lng = lng;
        if (staticMapImageUrl)
            res.geolocation.staticMapImageUrl = staticMapImageUrl;
        res.save((err, document) => {
            if (err) {
                console.log(err);
                return response.status(401).json({
                    message: 'Something went error. Failed to save profile data...'
                });
            }
            response.status(200).json({
                message: 'Profile saved successfully!',
            });
        });
    });
}

exports.acceptRequest = async (req, res, next) => {
    const { patientId, id } = { patientId: req.body.patientId, id: req.body.id };
    const foundDC = await DC.findById(id);
    if (foundDC) {
        foundDC.createdAt = undefined;
        const foundPatient = await Patient.findById(patientId);
        if (foundPatient) {
            foundPatient.createdAt = undefined;
            for(let i = 0; i < foundDC.patientList.length; i++) {
                if(foundDC.patientList[i].patient == patientId) {
                   foundDC.patientList[i].confirmed = true;
                   break;
                }
            }
            for(let i = 0; i < foundPatient.dcList.length; i++) {
                if(foundPatient.dcList[i].dc == id) {
                   foundPatient.dcList[i].confirmed = true;
                   break;
                }
            }
            foundDC.save((err, doc) => {
                if (err) {
                    return res.status(400).json({
                        message: 'Failed to save confirmed state at patient list'
                    });
                }
                foundPatient.save((err, document => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Failed to save confirmed state at doctor/coach list'
                        });
                    }
                    res.status(200).json({
                        message: 'Patient request has been accepted!'
                    });
                    const role = doc.role === 'doctor' ? 'D' : 'C' + doc.role.substring(1);
                    sendNotification(
                        [document.id.toString()],
                        `${role} Response`,
                        `${doc.profile.firstName + " " + doc.profile.lastName} has accepted your request.`
                    );
                }));
            });
        }
        else {
            res.status(401).json({
                message: 'Patient was not found.'
            });           
        }
    }
    else {
        res.status(401).json({
            message: 'User was not found.'
        });
    }
}

exports.sendPrescription = async (req, res, next) => {
    const { dcId, patientId, medication, situation, details } = { dcId: req.body.id, patientId: req.body.otherId, medication: req.body.prescription.medication, situation: req.body.prescription.situation, details: req.body.prescription.details };
    const foundDC = await DC.findById(dcId);
    if (foundDC) {
        if (foundDC.patientList.find(element => { return (element.patient == patientId && element.confirmed) })) {
            const foundPrescription = await Prescription.findOne({ patientId, dcId });
            if (foundPrescription) {
                foundPrescription.prescriptionList.push({
                    medication: medication,
                    situation: situation,
                    details: details
                });
                foundPrescription.save((err, document) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Something went wrong. Please try again later...'
                        });
                    }
                    res.status(200).json({
                        message: 'The prescription list has been updated!'
                    });
                    sendNotification(
                        [patientId.toString()],
                        'New Prescription',
                        `${foundDC.profile.firstName + " " + foundDC.profile.lastName} has just sent you a new prescription.`
                    );
                });
            }
            else {
                const newPrescription = new Prescription({
                    patientId: patientId,
                    dcId: dcId,
                    prescriptionList: []
                });
                newPrescription.prescriptionList.push({
                    medication: medication,
                    situation: situation,
                    details: details
                });
                newPrescription.save((err, document) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Something went wrong. Please try again later...'
                        });
                    }
                    res.status(200).json({
                        message: 'A new prescription list has been created!'
                    });
                    sendNotification(
                        [patientId.toString()],
                        'New Prescription',
                        `${foundDC.profile.firstName + " " + foundDC.profile.lastName} has just sent you a new prescription.`
                    );
                });
            }
        }
        else {
            res.status(400).json({
                message: 'Patient request is not confirmed or patient does not exist in the patients list...'
            });
        }
    }
    else {
        res.status(400).json({
            message: 'User was not found...'
        });
    }
}

exports.deletePatient = async (req, res, next) => {
    const { patientIdList, id } = { patientIdList: req.body.patientIdList, id: req.body.id };
    const foundDC = await DC.findById(id);
    if (foundDC) {
        let idList = [];
        const role = foundDC.role === 'doctor' ? 'D' : 'C' + doc.role.substring(1);
        foundDC.createdAt = undefined;
        patientIdList.forEach(async patientId => {
            const foundPatient = await Patient.findById(patientId);
            if (foundPatient) {
                foundPatient.createdAt = undefined;
                for (let i = 0; i < foundDC.patientList.length; i++) {
                    if (foundDC.patientList[i].patient == patientId) {
                        foundDC.patientList[i].deleted = true;
                        foundDC.patientList[i].confirmed = false;
                        break;
                    }
                }
                for (let i = 0; i < foundPatient.dcList.length; i++) {
                    if (foundPatient.dcList[i].dc == id) {
                        foundPatient.dcList[i].deleted = true;
                        foundPatient.dcList[i].confirmed = false;
                        break;
                    }
                }
                foundDC.save((err, document) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Failed to save a deleted state at patient list'
                        });
                    }
                    foundPatient.save((err, document => {
                        if (err) {
                            return res.status(400).json({
                                message: 'Failed to save a deleted state at doctor/coach list'
                            });
                        }
                        idList.push(patientId.toString());
                    }));
                });
            }
            else {
                return res.status(401).json({
                    message: 'Patient was not found.'
                });
            }
        });
        res.status(200).json({
            message: "Patients were flagged as deleted successfully!"
        });
        sendNotification(
            idList,
            `Removed ${role}`,
            `${foundDC.profile.firstName + " " + foundDC.profile.lastName} has removed you from their list.`
        );
    }
    else {
        res.status(401).json({
            message: 'User was not found.'
        });
    }
}
