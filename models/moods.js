let {matchedData} = require('express-validator/filter');
let {resSucc, resFail} = require('./helpers');


module.exports.add = (req, res) => {

    const successMsg = 'Added the mood';
    const failMsg = 'There was an error adding the mood';

    // matchedData comes from express-validator
    const formData = matchedData(req);

    // The document to be inserted into the collection
    const insertDoc = {
        username: res.locals.username,
        mood: formData.mood,
        pos: {
            type: "Point",
            coordinates: [formData.longitude, formData.latitude]
        }
    };

    req.app.locals.db.collection('moods').insertOne(insertDoc, (err, writeResult) => {

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

// Get all mood entries for the user
module.exports.moodEntriesForUsername = (req, res) => {

    const successMsg = 'Retrieved the mood entries';
    const failMsg = 'There was an error retrieving the mood entries';

    const sel = {
        username: res.locals.username
    };

    const proj = {
        _id: 0,
        mood: 1
    };

    req.app.locals.db.collection('moods').find(sel).project(proj).toArray((err, docs) => {

        if (err === null || err === undefined) {
            res.json(resSucc(successMsg, docs));

        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });
};
