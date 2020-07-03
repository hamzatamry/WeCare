const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const DC = require('../models/DC');
const bcrypt = require('bcryptjs');
const randomString = require('randomstring');
const transport = require('../misc/mailer');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.createUser = (req, res, next) => {
    const response = res;
    const { email, password, role } = req.body;
    hashPassword(password).then(hashedPassword => {
        const code = randomString.generate(12);
        let user;
        if (role === 'patient') {
            user = new Patient({
                email: email,
                verified: {
                    code: code
                },
                password: hashedPassword
            });
        }
        else {
            user = new DC({
                email: email,
                verified: {
                    code: code
                },
                password: hashedPassword,
                role: role
            });
        }
        user.save((err, document) => {
            if (err) {
                let message = role === 'patient' ? 'Email is already taken.' : 'Email is already taken. Remember that a user may only have a doctor or a coach account, not both.';
                if (!err.keyValue.email) {
                    message = 'The combination of the first and last name with the current role is already taken.';
                }
                return response.status(409).json({
                    message: message
                });
            }
            const html = `Hello there,
            <br/>
            Thank you for registering!
            <br/><br/>
            Please verify your email address by entering the following code:
            <br/>
            Verification Code: <b>${code}</b>
            <br/><br/>
            You have 2 hours until your registration expires after which your unverified account will be automatically deleted.
            <br/>
            Have a pleasant day!`;
            transport.sendMail({ from: 'healthappverifier@gmail.com', subject: 'Email Verification', to: email.toLowerCase(), html }
            , (err, info) => {
                if (err || info.rejected.length > 0) {
                    return response.status(400).json({
                        message: 'Could not establish communication with the provided email. Please try again later.'
                    });
                }
                response.status(201).json({
                    message: 'User added successfully but still needs to verify the email.',
                    id: document.id,
                    verified: document.verified.value,
                    profileSet: document.profile.set
                });
            });
        });
    });
}

exports.verifyUser = (req, res, next) => {
    const response = res;
    const { email, password, role } = req.body;
    const User = role === 'patient' ? Patient : DC; 
    User.findOne({ email }).then(user => {
        if (user) {
            validatePassword(password, user.password).then(validPassword => {
                if (validPassword) {
                    if (user.role && role !== user.role) 
                    {
                        const message = `User already has a ${user.role} account and cannot be a ${role}. Please login appropriately.`;
                        return response.status(401).json({
                            message: message
                        });
                    }
                    if (!user.verified.value) {
                        return response.status(200).json({
                            message: 'User is found but the email still needs to be verified.'
                        });
                    }
                    const newToken = jwt.sign({
                        email: user.email,
                        userId: user.id,
                        role: role
                    }, process.env.JWT_ACCESS_KEY
                    , { expiresIn: '930s' });
                    const newRefreshToken = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, process.env.JWT_REFRESH_KEY
                    , { expiresIn: '30d'});
                    User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }).then(() => {
                        response.status(201).json({
                            message: 'User logged in successfully!',
                            id: user.id,
                            verified: true,
                            token: newToken,
                            expiresIn: 930,
                            profileSet: user.profile.set
                        });
                    }).catch(err => {
                        response.status(400).json({
                            message: err.error.message
                        });
                    })
                }
                else {
                    response.status(401).json({
                        message: 'Password is incorrect.',
                    });
                }
            });
        }
        else {
            response.status(401).json({
                message: `User was not found. Please sign up as a ${role} first.`
            });
        }
    })
}

exports.verifyEmail = async (req, res, next) => {
    const { email, code, role } = req.body;
    let user = role === 'patient' ? Patient : DC;
    user.findOne({ email }).then(foundUser => {
        if (foundUser) {
            if (foundUser.verified.code === code) {
                foundUser.verified = {
                    value: true,
                    code: undefined,
                    resendTimeout: undefined
                };
                foundUser.createdAt = undefined;
                foundUser.save((err, document) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Something went wrong. Try again later.'
                        });
                    }
                });
                return res.status(200).json({
                    message: 'User is now verified.',
                    verified: foundUser.verified.value
                });
            }
            res.status(401).json({
                message: 'Entered code is incorrect.'
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: 'Something went wrong. Try again later.'
        })
    });
}

exports.sendResetCode = async (req, res, next) => {
    const { email, role } = req.body;
    const User = role === "patient" ? Patient : DC;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
        const resetCode = randomString.generate(12);
        foundUser.resetCode = resetCode;
        foundUser.createdAt = undefined;
        foundUser.save((err, document) => {
            if (err) {
                return res.status(400).json({
                    message: 'Something went wrong. Failed to save generated code...'
                });
            }
            const html = `Hello there,
            <br/>
            We just received a request for resetting your account password!
            <br/><br/>
            If you are the sender of this request, please enter the following code:
            <br/>
            Reset Code: <b>${resetCode}</b>
            <br/><br/>
            Have a pleasant day!`;
            transport.sendMail({ from: 'healthappverifier@gmail.com', subject: 'Password Reset', to: email.toLowerCase(), html }
            , (err, info) => {
                if (err || info.rejected.length > 0) {
                    return response.status(400).json({
                        message: 'Could not establish communication with the provided email. Please try again later.'
                    });
                }
                res.status(201).json({
                    message: 'Reset code was sent successfully. Check your email!'
                });
            });
        });
    }
    else {
        res.status(401).json({
            message: `User was not found. Please register as a ${role} first.`
        });
    }
}

exports.resetPassword = async (req, res, next) => {
    const { email, role, password, code } = req.body;
    const User = role === "patient" ? Patient : DC;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
        if (foundUser.resetCode !== code) {
            return res.status(401).json({
                message: 'Entered code is incorrect.'
            })
        }
        hashPassword(password).then(hashedPassword => {
            foundUser.password = hashedPassword;
            foundUser.createdAt = undefined;
            foundUser.resetCode = undefined;
            foundUser.save((err, document) => {
                if (err) {
                    return res.status(400).json({
                        message: 'Failed to save new password. Please try again later...'
                    });
                }
                res.status(201).json({
                    message: 'New password was set successfully. Please login to continue!'
                })
            })
        });
    }
    else {
        res.status(401).json({
            message: `User was not found. Please register as a ${role} first.`
        });
    }
}

exports.resend = (req, res, next) => {
    const response = res;
    const { email, role } = req.body;
    const User = role === 'patient' ? Patient : DC;
    User.findOne({ email }).then(foundUser => {
        if (foundUser && foundUser.verified.resendTimeout <= new Date()) {
            const code = randomString.generate(12);
            foundUser.verified = {
                code: code,
                resendTimeout: new Date(((new Date()).getTime()) + 60000 * 5)
            }
            foundUser.save((err, document) => {
                if (err) {
                    return response.status(400).json({
                        message: 'Something went wrong. Try again later.'
                    })
                }
                const html = `Hi,
                <br/>
                Per your request, this mail was sent with a new verfication code.
                <br/><br/>
                Please verify your email address by entering the following code:
                <br/>
                New Verification Code: <b>${code}</b>
                <br/><br/>
                Have a pleasant day!`;
                transport.sendMail({ from: 'healthappverifier@gmail.com', subject: 'Email Verification', to: email.toLowerCase(), html }
                , (err, info) => {
                    if (err || info.rejected.length > 0) {
                        return response.status(400).json({
                            message: 'Could not establish communication with the provided email. Please try again later.'
                        });
                    }
                    response.status(201).json({
                        message: 'User added successfully but still needs to verify the email.',
                        verified: document.verified.value
                    });
                });
            });
        }
        else {
            response.status(409).json({
                message: 'Failed to send a new code. Please try again later.'
            });
        }
    });
}

exports.getTimeout = (req, res, next) => {
    const { email, role } = { email: req.params.email, role: req.params.role };
    const User = role === 'patient' ? Patient : DC;
    User.findOne({ email }).then(foundUser => {
        res.status(200).json({
            resendTimeout: foundUser.verified.resendTimeout
        });
    }).catch(err => {
        res.status(400).json({
            message: 'Failed to get timeout. Please try again later.'
        });
    });
}

exports.saveProfile = async (req, res, next) => {
    const email = req.body.email;
    const role = req.body.role;
    const User = role === "patient" ? Patient : DC;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
        if (foundUser.profile.set) {
            return res.status(409).json({
                message: "Profile is already set."
            });
        }
        foundUser.createdAt = undefined;
        const { firstName, lastName, birthday, sex, phoneNumber, country, preferredNotificationTime, details, geolocation } = { firstName: req.body.firstName, lastName: req.body.lastName, birthday: req.body.birthday, sex: req.body.sex, phoneNumber: req.body.phoneNumber, country: req.body.country, preferredNotificationTime: req.body.preferredNotificationTime, details: req.body.details, geolocation: req.body.location };
        foundUser.profile.firstName = firstName;
        foundUser.profile.lastName = lastName;
        foundUser.profile.birthday = birthday;
        foundUser.profile.sex = sex;
        foundUser.profile.phoneNumber = phoneNumber;
        foundUser.profile.country = country;
        if (preferredNotificationTime)
            foundUser.notification.preferredTime = preferredNotificationTime;
        if (details)
            foundUser.details = details;
        if (geolocation)
            foundUser.geolocation = geolocation;
        if (role === 'patient') {
            const height = req.body.height;
            if (height.system === 'feet') {
                const value = (height.value * 0.3048).toFixed(2);
                height.value = +value;
            }
            const weight = req.body.weight;
            if (weight.system === 'pounds') {
                const value = (weight.value / 2.205).toFixed(2);
                weight.value = +value;
            }
            foundUser.physicalData.height = height.value;
            foundUser.physicalData.weight = weight.value;
            const { illnesses, disabilities, bloodType } = { illnesses: req.body.illnesses, disabilities: req.body.disabilities, bloodType: req.body.bloodType };
            if (illnesses)
                foundUser.medicalData.illnesses = illnesses;
            if (disabilities)
                foundUser.medicalData.disabilities = disabilities;
            foundUser.medicalData.bloodType = bloodType;
        }
        else {
            foundUser.profile.specialty = req.body.specialty;
        }
        foundUser.profile.set = true;
        foundUser.save((err, document) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    message: "Something went wrong. Please try again later..."
                })
            }
            res.status(200).json({
                message: "Profile data was saved successfully!"
            });
        });
    }
    else {
        res.status(401).json({
            message: `User was not found. Please register as a ${role} first.`
        });
    }
}

exports.saveProfileImage = async (req, res, next) => {
    const imagePath = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    const { email, role } = { email: req.body.email, role: req.body.role };
    const User = role === 'patient' ? Patient : DC;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
        foundUser.profile.imagePath = imagePath;
        foundUser.createdAt = undefined;
        foundUser.save((err, document) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    message: 'Something went wrong. Please try again later...'
                });
            }
            res.status(200).json({
                message: 'Image path was saved successfully!'
            });
        });
    }
    else {
        res.status(401).json({
            message: `User was not found. Please register as a ${role} first.`
        });
    }
}

exports.generateAccessToken = async (req, res, next) => {
    const { id, role } = req.body;
    const User = role === 'patient' ? Patient : DC;
    const foundUser = await User.findById(id);
    if (foundUser) {
        const refreshToken = foundUser.refreshToken;
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            const newToken = jwt.sign({
                email: foundUser.email,
                userId: foundUser.id,
                role: role
            }, process.env.JWT_ACCESS_KEY
            , { expiresIn: '930s' });
            res.status(201).json({
                message: 'New access token generated. You may continue sending requests to the server.',
                token: newToken,
                expiresIn: 930
            });
        } catch (err) {
            console.log(err);
            res.status(401).json({
                message: 'Your session has expired. Login again to renew it.'
            });
        }
    }
    else {
        res.status(401).json({
            message: `User was not found. Please register as a ${role} first.`
        });
    }
}
