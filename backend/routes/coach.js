const express = require('express');
const requestCheck = require('../middlewares/request-check');
const dcController = require('../controllers/DC');

const router = express.Router();

router.get('/profile/:id', requestCheck.authAndRoleAndIdParamCheck('coach'), dcController.getProfile);
router.get('/patientList/:id', requestCheck.authAndRoleAndIdParamCheck('coach'), dcController.getPatientList);
router.get('/patientData/sensorData/:id/:patientId', requestCheck.authAndRoleAndIdParamCheck('coach'), dcController.getSensorData);
router.get('/patientData/otherData/:id/:patientId', requestCheck.authAndRoleAndIdParamCheck('coach'), dcController.getOtherData);
router.get('/prescription/:id/:otherId', requestCheck.authAndRoleAndIdParamCheck('coach'), dcController.getPrescriptionList);
router.post('/profile', requestCheck.authAndRoleAndIdBodyCheck('coach'), dcController.saveProfile);
router.post('/acceptPatientRequest', requestCheck.authAndRoleAndIdBodyCheck('coach'), dcController.acceptRequest);
router.post('/prescription', requestCheck.authAndRoleAndIdBodyCheck('coach'), dcController.sendPrescription);
router.post('/deletePatient', requestCheck.authAndRoleAndIdBodyCheck('coach'), dcController.deletePatient);

module.exports = router;