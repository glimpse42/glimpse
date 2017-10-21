let {matchedData} = require('express-validator/filter');
let {resSucc, resFail} = require('./helpers');


module.exports.add = (req, res) => {

    const successMsg = 'Added the journal entry';
    const failMsg = 'There was an error adding the journal entry';

    const formData = matchedData(req);

    // The document to be inserted into the collection
    const insertDoc = {
        username: res.locals.username,
        journalEntry: formData.journalEntry,
        pos: {
            type: "Point",
            coordinates: [formData.longitude, formData.latitude]
        }
    };

    req.app.locals.db.collection('journals').insertOne(insertDoc, (err, writeResult) => {

        if (err === null || err === undefined) {

            if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
                res.json(resSucc(successMsg));
            } else {
                res.json(writeResult);
            }
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });

};

// Get all journal entries for the user
module.exports.journalEntriesForUsername = (req, res) => {

    const successMsg = 'Retrieved the journal entries';
    const failMsg = 'There was an error retrieving the journal entries';

    const sel = {
        username: res.locals.username
    };

    const proj = {
        _id: 0,
        journalEntry: 1
    };

    req.app.locals.db.collection('journals').find(sel).project(proj).toArray((err, docs) => {

        if (err === null || err === undefined) {
            res.json(resSucc(successMsg, docs));
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });
};

// Retrieve all journal entries near a point
module.exports.entriesNearPoint = (req, res) => {

    const formData = matchedData(req);

    const successMsg = 'Retrieved the journal entries';
    const failMsg = 'There was an error retrieving the journal entries';

    const sel = {
        username: res.locals.username,
        pos: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [formData.longitude, formData.latitude]
                }
            }
        }

    };

    req.app.locals.db.collection('journals').find(sel).toArray((err, docs) => {

        if (err === null || err === undefined) {
            res.json(resSucc(successMsg, docs));
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });
};