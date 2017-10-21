let express = require('express');
let checkAPI = require('express-validator/check');
let router = express.Router();
let usersModel = require('../models/users');

// Check for form validation errors
let validateForms = (req, res, next) => {

    const errors = checkAPI.validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({errors: errors.mapped()});
    }

    next();
};

// Check the cookie
let withAuth = (req, res, next) => {

    if (res.locals.username) {
        res.locals.username = req.signedCookie.username;
        next();
    } else {
        res.render('index', {title: 'Login'})
    }
};

// Form field validators
let firstnameValidator = checkAPI.body('firstname').exists().trim().matches(/[\w]{1,20}/).withMessage('Between 1 and 20 letters');
let lastnameValidator = checkAPI.body('lastname').exists().trim().matches(/[\w]{1,30}/).withMessage('Between 1 and 30 letters');
let usernameValidator = checkAPI.body('username').exists().trim().matches(/^[\w\d]{5,20}$/).withMessage('Between 5 and 20 letters and digits');
let passwordValidator = checkAPI.body('password').exists().matches(/^\S{8,20}$/).withMessage('Between 8 and 20 characters, no spaces.');
let emailValidator = checkAPI.body('email').exists().trim().isEmail().withMessage('Must be an email');
let aboutValidator = checkAPI.body('about').exists().trim().matches(/[\w ]{0,140}/).withMessage('Only letters and spaces');

// Validation middleware for forms
const loginValidation = [usernameValidator, passwordValidator];
const addUserValidation = [firstnameValidator, lastnameValidator, usernameValidator, passwordValidator, emailValidator];
const updateEmailValidation = [emailValidator];
const updateAboutValidation = [aboutValidator];

// Login
router.post('/login', [
    loginValidation,
    validateForms,
    usersModel.login
]);

// Add a user
router.post('/add', [
    addUserValidation,
    validateForms,
    usersModel.add
]);

// Update a user's email
router.post('/update/email', [
    withAuth,
    updateEmailValidation,
    validateForms,
    usersModel.updateEmail
]);

// Update a user's about message
router.post('/update/about', [
    withAuth,
    updateAboutValidation,
    validateForms,
    usersModel.updateAbout
]);

// Export this router
module.exports = router;