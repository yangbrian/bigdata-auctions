var express = require('express');
var router = express.Router();

var db = require('../database.js').db;

//gets the customer page
router.get('/', function (req, res) {

    res.render('customer', {
        title: 'Customer Rep Dashboard',
        check : 1
    })


});

//getting list of customers mailing lists
router.get('/get', function (req, res, next) {

    db.query('SELECT * FROM person ' +
        'INNER JOIN customer on person.SSN = customer.CustomerID',
        function (err, rows) {
            res.setHeader('content-type', 'application/json');
            console.log(rows);
            return res.send(JSON.stringify(rows));

        }
    );

});

//deleting a customer
router.post('/:customerID', function (req, res, next) {

    db.query('DELETE FROM customer ' +
        'WHERE customerID = ' + req.params.customerID,
        function (err, rows) {
            var data = {};
            if (err) {
                console.log("ERROR - " + err);
                data.success = false;
            } else {
                data.success = true;
            }


            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(data));


        })
})

//editing a customer
router.get('/editC/:customerID', function (req, res, next) {

    db.query('UPDATE customer ' +
    'SET Rating = ?, creditcardnum = ?, customerID = ? ' +
    'WHERE CustomerID =  ' + req.params.customerID,
        function (err, rows) {
            var data = {};
            if (err) {
                console.log("ERROR - " + err);
                data.success = false;
            } else {
                data.success = true;
            }

            res.render('customer', {
                title: 'Customer Info',
                editCust: rows,
                check: 3
            });

        })
})

//adding new customer
router.get('/newC', function (req, res, next) {

    db.query('SELECT * FROM person ' +
        'LEFT JOIN employee on EmployeeID = person.SSN ' +
        'LEFT JOIN customer on customerID = person.SSN ',
        function (err, rows) {
            if (err) throw err;
            res.render('customer', {
                title: 'Customer Info',
                newCust: rows,
                check: 2
            });

        });
});


//adding new customer
router.get('/newC/adding/:SSN', function (req, res, next) {


    res.render('newCustomer', {
        title: 'Customer Info',
        SSN: req.params.SSN
    });


});

//adding new customer
router.post('/newC/adding/:SSN', function (req, res, next) {

    db.query('INSERT INTO customer (Rating, creditcardnum, customerID) ' +
        'VALUES (?,?,?) ',
        [req.body.Rating, req.body.creditcardnum, req.params.SSN],
        function (err, rows) {
            if (err) throw err;
            res.redirect('/customer');
        });
});




//adding new customer
router.post('/:SSN', function (req, res, next) {

    db.query('INSERT INTO customer (Rating, creditcardnum, customerID) ' +
        'VALUES (?,?,?) ',
        [req.body.Rating, req.body.creditcardnum, req.params.SSN],
        function (err, rows) {
            if (err) throw err;
            res.redirect('/customer');
        });
});




module.exports = router;