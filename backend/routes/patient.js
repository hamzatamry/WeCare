const express = require('express');
const requestCheck = require('../middlewares/request-check');
const PatientController = require('../controllers/patient');

const router = express.Router();

router.get('/profile/:id', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getProfile);
router.get('/otherData/:id', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getOtherData);
router.get('/sensorData/:id', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getSensorData);
router.get('/dcList/:id', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getDCList);
router.get('/prescription/:id/:otherId', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getPrescriptionList);
router.get('/sampleWaitTime/:id', requestCheck.authAndRoleAndIdParamCheck('patient'), PatientController.getSensorWaitTime);
router.post('/profile', requestCheck.authAndRoleAndIdBodyCheck('patient'), PatientController.saveProfile);
router.post('/otherData', requestCheck.authAndRoleAndIdBodyCheck('patient'), PatientController.saveOtherData);
router.post('/patientRequest', requestCheck.authAndRoleAndIdBodyCheck('patient'), PatientController.sendPatientRequest);
router.post('/dcDelete', requestCheck.authAndRoleAndIdBodyCheck('patient'), PatientController.deleteDC);
router.post('/sample', requestCheck.authAndRoleAndIdBodyCheck('patient'), PatientController.addSample);

module.exports = router;
