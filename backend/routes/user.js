const express = require('express');
const UserController = require('../controllers/user');
const requestCheck = require('../middlewares/request-check');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type...");
        if (isValid) {
            error = null;
        }
        callback(error, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const extension = MIME_TYPE_MAP[file.mimetype];
        const fileName = name + '-' + Date.now() + '.' + extension;
        callback(null, fileName);
    }
});

router.post('/signup', UserController.createUser);

router.post('/login', UserController.verifyUser);

router.post('/verify', UserController.verifyEmail);

router.get('/timeout/:role/:email', UserController.getTimeout);

router.post('/resend', UserController.resend);

router.post('/resetRequest', UserController.sendResetCode);

router.post('/passwordReset', UserController.resetPassword);

router.post('/profile', requestCheck.authCheck(), UserController.saveProfile);

router.post('/profile-image', requestCheck.authCheck(), multer({ storage: storage }).single("image"), UserController.saveProfileImage);

router.post('/token', requestCheck.authAndIdBodyCheck(), UserController.generateAccessToken);

module.exports = router;