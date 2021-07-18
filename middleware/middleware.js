const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const User = require('../models/user');

//auth middleware
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check token existence
    if (!token)
        return res.status(401).redirect('/login')

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/')
        }
        return next();
    })
};

//Get the current user data by decoding the token
const checkCurrentUser = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        const user = jwt.verify(token, authConfig.secret, async (err, decoded) => {
            if (err) {
                return next();
            }

            let user = await User.findById({ _id: decoded.payload }).lean();
            if (user) {
                return user;
            }
            return res.redirect('/')
        });
        return user;
    }
    return next();
}

module.exports = {
    requireAuth,
    checkCurrentUser,
};