let express = require('express');
let checkAPI = require('express-validator/check');
let router = express.Router();
let moodsModel = require('../models/moods');
let {withAuth} = require('./helpers');

// check in mood is one of the values for the enum
let moodValidator = checkAPI.body('mood').exists().trim().withMessage('Only letters and spaces');
let geoCoordValidator = checkAPI.body(['latitude', 'longitude']).exists().isFloat().toFloat().withMessage('Lat or long as decimal');

const addMoodsValidation = [moodValidator, geoCoordValidator];

// Add a mood - withAuth - user can't add a mood unless authenticated
router.post('/add', [
    withAuth,
    addMoodsValidation,
    moodsModel.add
]);

// Get all entries for the user
router.get('/getEntries', [
    withAuth,
    moodsModel.moodEntriesForUsername
]);

module.exports = router;