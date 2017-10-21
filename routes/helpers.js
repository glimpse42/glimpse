let checkAPI = require('express-validator/check');

// Check for form validation errors
module.exports.validateForms = (req, res, next) => {

    const errors = checkAPI.validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({errors: errors.mapped()});
    }

    next();
};

// Check the cookie
module.exports.withAuth = (req, res, next) => {

    if (res.locals.username) {
        //res.locals.username = req.signedCookie.username;
        next();
    } else {
        res.render('index', {title: 'Login'})
    }
};