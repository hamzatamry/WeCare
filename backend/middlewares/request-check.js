const jwt = require('jsonwebtoken');

module.exports = {
    authCheck: () => {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, process.env.JWT_ACCESS_KEY);
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    },
    authAndIdParamCheck: () => {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                if (req.params.id != decodedToken.userId) {
                    console.log("reqId: " + req.params.id);
                    console.log("tokenId: " + decodedToken.userId);
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible id...'});
                }
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    },
    authAndIdBodyCheck: () => {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY)
                if (req.body.id != decodedToken.userId) {
                    console.log("reqId: " + req.body.id);
                    console.log("tokenId: " + decodedToken.userId);
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible id...'});
                }
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    },
    authAndRoleCheck: function authAndRoleCheck(requestedRole) {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                if (requestedRole !== decodedToken.role) {
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible role...' });
                }
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    },
    authAndRoleAndIdParamCheck: function authAndRoleAndIdCheck(requestedRole) {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                if (requestedRole !== decodedToken.role) {
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible role...' });
                }
                if (req.params.id != decodedToken.userId) {
                    console.log("reqId: " + req.params.id);
                    console.log("tokenId: " + decodedToken.userId);
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible id...' });
                }
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    },
    authAndRoleAndIdBodyCheck: function authAndRoleAndIdCheck(requestedRole) {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                if (requestedRole !== decodedToken.role) {
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible role...' });
                }
                if (req.body.id != decodedToken.userId) {
                    console.log("reqId: " + req.body.id);
                    console.log("tokenId: " + decodedToken.userId);
                    return res.status(401).json({ message: 'Unauthorized access to ressource. Incompatible id...' });
                }
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized access to ressource...' });
            }
        }
    }
}
