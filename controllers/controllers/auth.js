// MODEL IMPORT
const User = require('../models/user');
const jwt = require('jsonwebtoken'); //  To generate signed token;
const { expressjwt } = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    // console.log('req.body', res.body);
    const user = new User(req.body);
    user.save((err, user) => {
        console.log("user", err)
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        // DONT RETURN SALT && HASHED_PASSWORD
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    })
}

exports.signin = (req, res) => {
    // Find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please Signup'
            });
        }

        // If user is found make sure the email and password match
        // Create authenticate method in user model
        if(!user.authenticate(password)) {
            return re.status(401).json({
                error: 'Email and password dont match'
            });
        }
        // Generate a signed token with user id && secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // Persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date( + 9999) });
        // Return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        return res.status(403).json({
            error: 'Access denied, Not your profile dude. Take a candy and sin no more!!'
        });
    }

    next();

};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access denied. Why dont you like to mind your business?'
        });
    }

    next();

};