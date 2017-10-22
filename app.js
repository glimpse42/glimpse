let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let request = require('request').defaults({encoding: null })

let index = require('./routes/index');
let user = require('./routes/user');
let journal = require('./routes/journal');

let app = express();

var sessionCookie; // cookie identifying user's Usher session
var userToken; // user's access token
var userID; // user's badge id

const SECURE_CLOUD = "https://env-72355.customer.cloud.microstrategy.com:2443";
const ORG_ID = 2; // your app info
const APP_ID = 17; // your app info

// view engine setup
//app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(process.env.APP_SECRET || '123abc456def'));
app.use(express.static(path.join(__dirname, 'public')));

// Check the authentication
app.use((req, res, next) => {
    res.locals.username = req.signedCookies.username;
    next();
});

// Routes
app.use('/', index);
app.use('/user', user);
app.use('/journal', journal);

app.get('/getQRCode', function(req, res){
    var requestOptions = {
        method: 'POST',
        url: SECURE_CLOUD + "/sso/create_registration_session"
        + "?client_id=" + APP_ID + "&return_image=true&session_data=%7B%22description%22%3A%20%22sampleApp%22%7D"
    };
    request(requestOptions, function(error, response, body){
        if(error){
            res.status(500).send('Bad request');
        } else{
            if(body != null && body.length > 0) {
                response.headers["set-cookie"].forEach(function (cookie) {
                    if (cookie.indexOf("SSO_SESSION=") != -1) {
                        sessionCookie = cookie; // save the session cookie
                    }
                });
            }
            res.send(body);
        }
    });
});

app.get('/checkScanned', function(req, res){
    var requestOptions = {
        method: 'GET',
        url: SECURE_CLOUD + "/sso/wait"
        + "?client_id=" + APP_ID + "&session_type=nonblock&return_token=1",
        headers: {
            Cookie: sessionCookie // pass in session cookie so Usher Server can identify session
        }
    };
    request(requestOptions, function(error, response, body){
        if(error){
            res.status(500).send('Bad request');
        } else {
            if(body != null && body.length > 0) {
                var parsedBody = JSON.parse(body);
                if (parsedBody.access_token != null) {
                    userToken = parsedBody.access_token; // get user access token
                    userID = parsedBody.badge_id; // get user badge id
                }
            }
            res.send(parsedBody);
        }
    });
});

app.get('/getUserPhoto', function(req, res){
    var requestOptions = {
        method: 'GET',
        url: SECURE_CLOUD + "/user/get_public_image/badge/" + userID
        + "?access_token=" + userToken
    };
    request(requestOptions, function(error, response, body){
        if(error){
            res.status(500).send('Bad request');
        } else {
            if(body != null && body.length > 0) {
                body = new Buffer(body).toString('base64'); // response body is a byte buffer, need to encode to base64
            }
            res.send(body);
        }
    });
});

app.get('/getUserInfo', function(req, res){
    var requestOptions = {
        method: 'GET',
        url: SECURE_CLOUD + "/badge/org/" + ORG_ID
        + "?access_token=" + userToken
    };
    request(requestOptions, function(error, response, body){
        if(error){
            res.status(500).send('Bad request');
        } else {
            if(body != null && body.length > 0) {
                body = JSON.parse(body)[0];
            }
            res.send(body);
        }
    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
