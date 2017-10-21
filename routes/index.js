let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    if (res.locals.username) {
        res.render('dashboard')
    } else {
        res.render('index', {title: 'Express'});
    }
});

module.exports = router;
