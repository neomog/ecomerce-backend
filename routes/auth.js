// EXPRESS ROUTER IMPORT
const express = require('express');
const router = express.Router();

// CONTROLLERS && MIDLEWARES IMPORTS
const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidation } = require('../validator');

// ROUTES
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;