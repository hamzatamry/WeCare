const express = require('express');
const requestCheck = require('../middlewares/request-check');
const dcController = require('../controllers/DC');

const router = express.Router();

router.get('/profile/:id', requestCheck.authAndRoleAndIdParamCheck('doctor'), dcController.getProfile);
router.get('/patientList/:id', requestCheck.authAndRoleAndIdParamCheck('doctor'), dcController.getPatientList);
router.get('/patientData/sensorData/:id/:patientId', requestCheck.authAndRoleAndIdParamCheck('doctor'), dcController.getSensorData);
router.get('/patientData/otherData/:id/:patientId', requestCheck.authAndRoleAndIdParamCheck('doctor'), dcController.getOtherData);
router.get('/prescription/:id/:otherId', requestCheck.authAndRoleAndIdParamCheck('doctor'), dcController.getPrescriptionList);
router.post('/profile', requestCheck.authAndRoleAndIdBodyCheck('doctor'), dcController.saveProfile);
router.post('/acceptPatientRequest', requestCheck.authAndRoleAndIdBodyCheck('doctor'), dcController.acceptRequest);
router.post('/prescription', requestCheck.authAndRoleAndIdBodyCheck('doctor'), dcController.sendPrescription);
router.post('/deletePatient', requestCheck.authAndRoleAndIdBodyCheck('doctor'), dcController.deletePatient);

module.exports = router;