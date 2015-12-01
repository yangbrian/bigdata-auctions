var express = require('express');
var router = express.Router();

var db = require('../database.js').db;

/* /auction home page */
router.get('/', function (req, res, next) {

    res.send('This page does nothing right now. Please enter an ID');
});

router.get('/c', function (req, res, next) {

console.log("!")
    //db.query('SELECT * FROM customer',
    //        function (err, rows) {
    //        if (err) throw err;
    db.query('SELECT * FROM person ',
        'INNER JOIN customer on person.SSN = customer.customerID',
        function (err, rows) {
            console.log(rows.length);
            if (err) throw err;
            res.render('customer32', {
                title: 'Customer Info',
                customers: rows
            });
        }
    );
    //
    //
    //});


});


module.exports = router;