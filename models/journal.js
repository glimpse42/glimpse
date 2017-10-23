let {matchedData} = require('express-validator/filter');
let {resSucc, resFail} = require('./helpers');

let getTs = () => {

};

// Add a journal entry for the user
module.exports.add = (req, res) => {

    const successMsg = 'Added the journal entry';
    const failMsg = 'There was an error adding the journal entry';

    // Validated form data
    const formData = matchedData(req);

    // The document to be inserted into the collection
    const insertDoc = {
        username: res.locals.username,
        journalEntry: formData.journalEntry,
        timestamp: (new Date()).getTime(),
        pos: {
            type: "Point",
            coordinates: [formData.longitude, formData.latitude]
        }
    };

    // Insert the journal entry into the database
    req.app.locals.db.collection('journals').insertOne(insertDoc).then((writeResult) => {
        res.json(resSucc(successMsg));
    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });

};


// Delete a journal entry for the user
module.exports.delete = (req, res) => {

    const successMsg = 'Added the journal entry';
    const failMsg = 'There was an error removing the journal entry';

    // Remove the journal entry into the database
    req.app.locals.db.collection('journals').removeOne({}).then((writeResult) => {
        res.json(resSucc(successMsg));
    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    })

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
        username: 0
    };

    // TODO: Do I really need to be using the resSucc wrapper? Shouldn't I be using http status codes?
    // Yes, I think, so that the response format is always the same, regardless of success
    req.app.locals.db.collection('journals').find(sel).project(proj).toArray().then((docs) => {
        res.json(resSucc(successMsg, docs));
    }, (reason) => {
        res.json(resFail(failMsg));
        console.log(reason);
    });
};


// Get all journal entries for the user
module.exports.geoJsonEntries = (req, res) => {

    const successMsg = 'Retrieved the journal entries';
    const failMsg = 'There was an error retrieving the journal entries';

    const sel = {
        username: res.locals.username
    };

    const proj = {
        _id: 0,
        username: 0
    };

    req.app.locals.db.collection('journals').find(sel).project(proj).toArray().then((docs) => {

        // format into geoJSON
        const geoJSONEntries = docs.map((doc) => {
            return {
                type: "Feature",
                properties: {
                    timestamp: doc.timestamp,
                    journalEntry: doc.journalEntry
                },
                geometry: doc.pos
            }
        });

        res.json({type: "FeatureCollection", features: geoJSONEntries});
    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });
};

// Retrieve all journal entries near a point
module.exports.journalEntriesNearPoint = (req, res) => {

    // Validated form data
    const formData = matchedData(req);

    console.log(formData);

    const successMsg = 'Retrieved the journal entries near point';
    const failMsg = 'There was an error retrieving the journal entries near the point';

    const sel = {
        username: res.locals.username,
        pos: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [formData.longitude, formData.latitude]
                },
                $maxDistance: 20
            }
        }

    };

    req.app.locals.db.collection('journals').find(sel).toArray()((docs) => {
        res.json(resSucc(successMsg, docs));
    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });
};