var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

router.get('/', auth, function (req, res) {
    db.query(
        'SELECT * FROM Item', function (err, items) {

            res.render('items', {
                    title: 'Viewing All Items ',
                    items: items
                }

            )}
    )}
);
module.exports = router;