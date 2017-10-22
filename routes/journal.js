let express = require('express');
let checkAPI = require('express-validator/check');
let router = express.Router();
let journalModel = require('../models/journal');
let {withAuth} = require('./helpers');


let journalEntryValidator = checkAPI.body('journalEntry').exists().trim().withMessage('Only letters and spaces');
let geoCoordValidator = checkAPI.body(['latitude', 'longitude']).exists().isFloat().toFloat().withMessage('Lat or long as decimal');

const addJournalEntryValidation = [journalEntryValidator, geoCoordValidator];

const entriesNearPointValidation = [geoCoordValidator];

// Add a journal entry
router.post('/add', [
    withAuth,
    addJournalEntryValidation,
    journalModel.add
]);

// Get all entries for the user
router.get('/getEntries', [
    withAuth,
    journalModel.journalEntriesForUsername
]);

// Get all entries for the user in geoJSON format
router.get('/geoJSONEntries', [
    withAuth,
    journalModel.geoJsonEntries
]);

router.post('/entriesNearPoint', [
    withAuth,
    entriesNearPointValidation,
    journalModel.journalEntriesNearPoint
]);

module.exports = router;