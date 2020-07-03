const Patient = require('../models/patient');
const Prescription = require('../models/prescription');
const DC = require('../models/DC');
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
    Patient.findById(req.params.id, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        response.status(200).json({
            message: 'Profile fetched successfully!',
            firstName: res.profile.firstName,
            lastName: res.profile.lastName,
            birthday: res.profile.birthday,
            sex: res.profile.sex,
            phoneNumber: res.profile.phoneNumber,
            country: res.profile.country,
            address: res.geolocation.address,
            staticMapImageUrl: res.geolocation.staticMapImageUrl,
            imagePath: res.profile.imagePath,
            lat: res.geolocation.lat,
            lng: res.geolocation.lng
        });
    });
}

exports.getOtherData = (req, res, next) => {
    const response = res;
    Patient.findById(req.params.id, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        response.status(200).json({
            message: 'Data fetched successfully!',
            height: res.physicalData.height,
            weight: res.physicalData.weight,
            illnesses: res.medicalData.illnesses,
            disabilities: res.medicalData.disabilities,
            bloodType: res.medicalData.bloodType,
            details: res.details
        });
    });
}

exports.getSensorData = (req, res, next) => {
    const response = res;
    Patient.findById(req.params.id, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        response.status(200).json({
            message: 'Sensor data fetched successfully!',
            sensorData: {
                temperature: res.sensorData.temperature,
                bloodPressure: res.sensorData.bloodPressure,
                heartbeat: res.sensorData.heartbeat,
                glucose: res.sensorData.glucose,
                steps: res.sensorData.steps,
                oxygen: res.sensorData.oxygen,
                dates: res.sensorData.dates
            },
            sex: res.profile.sex
        });
    });
}

exports.getDCList = (req, res, next) => {
    const response = res;
    Patient.findById(req.params.id)
    .populate({
        path: 'dcList.dc',
        select: [ 'profile.firstName', 'profile.lastName', 'role', 'profile.birthday', 'profile.specialty', 'profile.sex', 'email', 'profile.phoneNumber', 'geolocation.address', 'profile.imagePath' ]
    }).then(document => {
        if (!document) {
            return response.status(401).json({
                message: 'Something went wrong. Please try again later...'
            });
        }
        let dcList = [];
        document.dcList.forEach(element => {
            if (!element.deleted) {
                if (!element.confirmed) {
                    element.dc._id = null;
                    element.dc.profile.sex = undefined;
                    element.dc.email = undefined;
                    element.dc.profile.phoneNumber = undefined;
                    element.dc.geolocation = undefined;
                }
                dcList.push(element);
            }
        });
        response.status(200).json({
            message: 'DC list fetched successfully!',
            dcList: dcList
        });
    });
}

exports.getPrescriptionList = async (req, res, next) => {
    const foundPrescription = await Prescription.findOne({ patientId: req.params.id, dcId: req.params.otherId });
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
    Patient.findById(userId, (err, res) => {
        if (err) {
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        const { firstName, lastName, birthday, sex, phoneNumber, country, address, lat, lng, staticMapImageUrl } = { firstName: req.body.profile.firstName, lastName: req.body.profile.lastName, birthday: req.body.profile.birthday, sex: req.body.profile.sex, phoneNumber: req.body.profile.phoneNumber, country: req.body.profile.country, address: req.body.profile.address, lat: req.body.profile.lat, lng: req.body.profile.lng, staticMapImageUrl: req.body.profile.staticMapImageUrl };
        res.createdAt = undefined;
        res.profile.firstName = firstName;
        res.profile.lastName = lastName;
        res.profile.birthday = birthday;
        res.profile.sex = sex;
        res.profile.phoneNumber = phoneNumber;
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

exports.saveOtherData = (req, res, next) => {
    const response = res;
    const userId = req.body.id;
    Patient.findById(userId, (err, res) => {
        if (err) {
            console.log(err);
            return response.status(401).json({
                message: 'User was not found...'
            });
        }
        const { height, weight, illnesses, disabilities, bloodType, details } = { height: req.body.data.height, weight: req.body.data.weight, illnesses: req.body.data.illnesses, disabilities: req.body.data.disabilities, bloodType: req.body.data.bloodType, details: req.body.data.details };
        res.createdAt = undefined;
        res.physicalData.height = height;
        res.physicalData.weight = weight;
        res.medicalData.illnesses = illnesses;
        res.medicalData.disabilities = disabilities;
        res.medicalData.bloodType = bloodType;
        res.details = details;
        res.save((err, document) => {
            if (err) {
                console.log(err);
                return response.status(401).json({
                    message: 'Something went error. Failed to save data...'
                });
            }
            response.status(200).json({
                message: 'Data saved successfully!'
            });
        });
    });
}

exports.sendPatientRequest = async (req, res, next) => {
    const foundPatient = await Patient.findById(req.body.id);
    if (foundPatient) {
        const { firstName, lastName, specialty, birthday } = { firstName: req.body.dc.firstName, lastName: req.body.dc.lastName, specialty: req.body.dc.specialty, birthday: req.body.dc.birthday };
        const role = req.body.dc.role;
        const foundDC = await DC.findOne({ 'profile.firstName': firstName, 'profile.lastName': lastName, role, 'profile.specialty': specialty, 'profile.birthday': birthday });
        if (foundDC) {
            let flagged = false;
            foundPatient.createdAt = undefined;
            foundDC.createdAt = undefined;
            for (let i = 0; i < foundPatient.dcList.length; i++) {
                if (foundPatient.dcList[i].dc == foundDC.id) {
                    if (!foundPatient.dcList[i].deleted) {
                        return res.status(409).json({
                            message: `User has already sent a request to the ${foundDC.role}`
                        });
                    }
                    else {
                        flagged = true;
                        foundPatient.dcList[i].deleted = false;
                        for (let j = 0; j < foundDC.patientList.length; j++) {
                            if (foundDC.patientList[j].patient == foundPatient.id) {
                                foundDC.patientList[j].deleted = false;
                                break;
                            }
                        }
                        foundPatient.save((err, doc) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    message: 'Something went wrong. Failed to proccess request...'
                                }); 
                            }
                            foundDC.save((err, document) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(400).json({
                                        message: 'Something went wrong. Failed to proccess request...'
                                    }); 
                                }
                                sendNotification(
                                    [document.id.toString()], 
                                    'Patient Request', 
                                    `${doc.profile.firstName + " " + doc.profile.lastName} has just sent you a new patient request.`
                                );
                                return res.status(200).json({
                                    message: 'Patient added successfully!'
                                });
                            });
                        });
                        break;
                    }
                }
            }
            if (!flagged) {
                foundPatient.dcList.push({ confirmed: false, dc: foundDC.id });
                foundDC.patientList.push({ confirmed: false, patient: req.body.id });
                foundPatient.save((err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            message: 'Something went wrong. Failed to proccess request...'
                        }); 
                    }
                    foundDC.save((err, document) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                message: 'Something went wrong. Failed to proccess request...'
                            }); 
                        }
                        sendNotification(
                            [document.id.toString()], 
                            'Patient Request', 
                            `${doc.profile.firstName + " " + doc.profile.lastName} has just sent you a new patient request.`
                        );
                        res.status(200).json({
                            message: 'Patient request sent successfully!'
                        });
                    });
                });
            }
        }
        else {
            res.status(400).json({
                message: `The ${role} was not found. Please verify your input...`
            });
        }
    }
    else {
        res.status(400).json({
            message: 'User was not found. Please try again...'
        });
    }
}

exports.deleteDC = async (req, res, next) => {
    const { dcIdList, id } = { dcIdList: req.body.dcIdList, id: req.body.id };
    const foundPatient = await Patient.findById(id);
    if (foundPatient) {
        foundPatient.createdAt = undefined;
        let idList = [];
        dcIdList.forEach(async dcId => {
            const foundDC = await DC.findById(dcId);
            if (foundDC) {
                foundDC.createdAt = undefined;
                for (let i = 0; i < foundDC.patientList.length; i++) {
                    if (foundDC.patientList[i].patient == id) {
                        foundDC.patientList[i].deleted = true;
                        foundDC.patientList[i].confirmed = false;
                        break;
                    }
                }
                for (let i = 0; i < foundPatient.dcList.length; i++) {
                    if (foundPatient.dcList[i].dc == dcId) {
                        foundPatient.dcList[i].deleted = true;
                        foundPatient.dcList[i].confirmed = false;
                        break;
                    }
                }
                foundDC.save((err, doc) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Failed to save a deleted state at patients list...'
                        });
                    }
                    foundPatient.save((err, document => {
                        if (err) {
                            return res.status(400).json({
                                message: 'Failed to save a deleted state at doctors/coachs list...'
                            });
                        }
                        idList.push(doc.id.toString());
                    }));
                });
            }
            else {
                return res.status(401).json({
                    message: 'Doctor/Coach was not found.'
                });
            }
        });
        res.status(200).json({
            message: "DCs were flagged as deleted successfully!"
        });
        sendNotification(
            idList, 
            'Removed Patient', 
            `Patient ${foundPatient.profile.firstName + " " + foundPatient.profile.lastName} has removed you from their list.`
        );
    }
    else {
        res.status(401).json({
            message: 'User was not found.'
        });
    }
}

exports.addSample = async (req, res, next) => {
    const { id, sensorData, normalLevels } = { id: req.body.id, sensorData: req.body.sensorData, normalLevels: req.body.normal };
    const foundPatient = await Patient.findById(id);
    if (foundPatient) {
        foundPatient.createdAt = undefined;
        const sampleDate = new Date(sensorData.date);
        const dayIndex = sampleDate.getDay();
        if (Math.abs(new Date().getTime() - sampleDate.getTime()) > 26 * 3600 * 1000) {
            return res.status(409).json({
                message: 'A timezone error occured. Please adjust your device local time...'
            });
        }
        if (sampleDate.getHours() < 10) {
            return res.status(409).json({
                message: 'Please wait until 10 AM today before taking a new sample...'
            });
        }
        const waitTime = foundPatient.sensorData.waitTime;
        if (new Date().getTime() - foundPatient.sensorData.lastSampleServerTime.getTime() < waitTime * 3600 * 1000) {
            return res.status(409).json({
                message: 'User should wait until the countdown ends. Please try again later...'
            });
        }
        if (foundPatient.sensorData.temperature.values[dayIndex].length === 4) {
            foundPatient.sensorData.temperature.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.bloodPressure.values[dayIndex].length === 4) {
            foundPatient.sensorData.bloodPressure.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.heartbeat.values[dayIndex].length === 4) {
            foundPatient.sensorData.heartbeat.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.glucose.values[dayIndex].length === 4) {
            foundPatient.sensorData.glucose.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.steps.values[dayIndex].length === 4) {
            foundPatient.sensorData.steps.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.oxygen.values[dayIndex].length === 4) {
            foundPatient.sensorData.oxygen.values[dayIndex] = [];
        }
        if (foundPatient.sensorData.dates[dayIndex].length === 4) {
            foundPatient.sensorData.dates[dayIndex] = [];
        }
        foundPatient.sensorData.lastSampleServerTime = new Date();
        (foundPatient.sensorData.temperature.values[dayIndex]).push(sensorData.temperature.value);
        foundPatient.sensorData.temperature.state = sensorData.temperature.state;
        (foundPatient.sensorData.bloodPressure.values[dayIndex]).push(sensorData.bloodPressure.value);
        foundPatient.sensorData.bloodPressure.state = sensorData.bloodPressure.state;
        (foundPatient.sensorData.heartbeat.values[dayIndex]).push(sensorData.heartbeat.value);
        foundPatient.sensorData.heartbeat.state = sensorData.heartbeat.state;
        (foundPatient.sensorData.glucose.values[dayIndex]).push(sensorData.glucose.value);
        foundPatient.sensorData.glucose.state = sensorData.glucose.state;
        (foundPatient.sensorData.steps.values[dayIndex]).push(sensorData.steps.value);
        foundPatient.sensorData.steps.state = sensorData.steps.state;
        (foundPatient.sensorData.oxygen.values[dayIndex]).push(sensorData.oxygen.value);
        foundPatient.sensorData.oxygen.state = sensorData.oxygen.state;
        (foundPatient.sensorData.dates[dayIndex]).push(sensorData.date);
        if (foundPatient.sensorData.dates[dayIndex].length === 4) {
            foundPatient.sensorData.waitTime = 24 - Math.abs(sampleDate.getHours() - 10);
        }
        else {
            foundPatient.sensorData.waitTime = 4;
        }
        foundPatient.markModified('sensorData.temperature.values');
        foundPatient.markModified('sensorData.bloodPressure.values');
        foundPatient.markModified('sensorData.heartbeat.values');
        foundPatient.markModified('sensorData.glucose.values');
        foundPatient.markModified('sensorData.steps.values');
        foundPatient.markModified('sensorData.oxygen.values');
        foundPatient.markModified('sensorData.dates');
        foundPatient.save((err, document) => {
            if (err) {
                return res.status(400).json({
                    message: 'Something went wrong. Please try again...'
                });
            }
            res.status(200).json({
                message: 'Sample data has been saved successfully!',
                waitTime: document.sensorData.waitTime
            });
            if (!normalLevels) {
                let idList = [];
                document.dcList.forEach(element => {
                    if (element.confirmed && !element.deleted)
                        idList.push(element.dc.toString());
                });
                sendNotification(
                    idList,
                    'Patient Sample Warning',
                    `Patient ${document.profile.firstName + " " + document.profile.lastName} just had some abnormal levels in their new sample.`
                );
            }
        });
    }
    else {
        res.status(401).json({
            message: 'User was not found.'
        });
    }
}

exports.getSensorWaitTime = async (req, res, next) => {
    const id = req.params.id;
    const foundPatient = await Patient.findById(id);
    if (foundPatient) {
        let waitTime = null;
        const currentTime = new Date();
        const nextAvailableTime = new Date(+foundPatient.sensorData.lastSampleServerTime + foundPatient.sensorData.waitTime * 3600 * 1000);
        if (currentTime < nextAvailableTime) {
            waitTime = nextAvailableTime.getTime() - currentTime.getTime();
        }
        res.status(200).json({
            message: "Sensor wait time fetched successfully!",
            originalWaitTime: foundPatient.sensorData.waitTime * 3600 * 1000,
            waitTime: waitTime
        });
    }
    else {
        res.status(401).json({
            message: 'User was not found.'
        });
    }
}
