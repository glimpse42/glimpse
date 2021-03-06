let {matchedData} = require('express-validator/filter');
let {resSucc, resFail} = require('./helpers');

// Get all users
module.exports.get = (req, res) => {

};


/**
 * Add a user to the system
 *
 * @param req
 * @param res
 */
module.exports.add = (req, res) => {

    // Get document from validator
    let insertDoc = matchedData(req);

    // Fields not included with the form
    insertDoc.about = "";

    const successMsg = 'Added the user';
    const failMsg = 'There was an error adding the user';

    req.app.locals.db.collection('users').insertOne(insertDoc).then((writeResult) => {

        if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
            res.json(resSucc(successMsg));
        } else {
            res.json(writeResult);
        }

    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });
};


// Check a user's credentials
module.exports.login = (req, res) => {

    const successMsg = 'Valid credentials';
    const failMsg = 'Invalid credentials';

    let insertDoc = matchedData(req);

    let options = {
        fields: {
            _id: 0,
            username: 1
        }
    };

    req.app.locals.db.collection("users").findOne(insertDoc, options).then((userObj) => {

        const sessionLength = 7 * 24 * 60 * 60 * 1000;

        if (userObj === null) {
            res.render('index', {title: 'Login'})
        } else {

            // Set the authentication cookie
            res.cookie('username', userObj.username, {
                httpOnly: true,
                maxAge: sessionLength,
                signed: true
            });

            res.redirect('/');
        }

    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });

};


/**
 * Remove a user
 *
 * @param req
 * @param res
 */
module.exports.remove = (req, res) => {

    const successMsg = 'Removed the user';
    const failMsg = 'There was an error removing the user';

    const sel = matchedData(req);

    req.app.locals.db.collection('users').deleteOne(sel).then((writeResult) => {

        if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
            res.json(resSucc(successMsg));
        } else {
            console.log(writeResult);
            res.json(resFail(failMsg));
        }

    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });

};


/**
 * Update a user's email
 *
 * @param req
 * @param res
 */
module.exports.updateEmail = (req, res) => {

    const successMsg = 'Updated the user email';
    const failMsg = 'There was an error updating the email';

    let sel = {
        username: res.locals.username
    };

    let upd = {
        $set: matchedData(req)
    };

    // Insert a document into the database
    req.app.locals.db.collection('users').updateOne(sel, upd).then((writeResult) => {

        if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
            res.json(resSucc(successMsg));
        } else {
            res.json(writeResult);
        }
    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });
};


/**
 * Update the about message for a user
 *
 * @param req
 * @param res
 */
module.exports.updateAbout = (req, res) => {

    const successMsg = 'Updated the about message';
    const failMsg = 'There was an error updating the about message';

    let sel = {
        username: res.locals.username
    };

    let upd = {
        $set: matchedData(req)
    };

    // Insert a document into the database
    req.app.locals.db.collection('users').updateOne(sel, upd).then((writeResult) => {

        if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
            res.json(resSucc(successMsg));
        } else {
            res.json(writeResult);
        }

    }, (reason) => {
        console.log(reason);
        res.json(resFail(failMsg));
    });

};