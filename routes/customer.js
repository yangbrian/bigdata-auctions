var express = require('express');
var router = express.Router();

var db = require('../database.js').db;

//getting list of customers
router.get('/', function (req, res, next) {


    db.query('SELECT * FROM person ',
        'INNER JOIN customer on person.SSN = customer.customerID',
        function (err, rows) {
            console.log(rows.length);
            if (err) throw err;
            res.render('customer', {
                title: 'Customer Info',
                customers: rows,
                check : 1
            });
        }
    );

});

//editing a customer
router.get('/', function (req, res, next){

    db.query('UPDATE customer ',
        'SET Rating = ?, creditcardnum = ?, ',
        'WHERE customerID = ?' ,
        [req.body.Rating, req.body.creditcardnum, req.params.customerID],
        function(err, rows){
            if(err)throw err;

        })

});

//deleting a customer
router.get('/', function(req, res, next){

    db.query('DELETE FROM customer ',
        'WHERE customerID = ' +req.params.customerID,
        function(err, rows){
            if(err)throw err;

        })
})

//adding new customer
router.get('/newC', function(req, res, next) {

    db.query('SELECT * FROM person ' +
        'LEFT JOIN employee on EmployeeID = person.SSN ',
        function (err, rows) {
            if (err) throw err;
            console.log("----")
            console.log(rows);
            res.render('customer', {
                title: 'Customer Info',
                newCust: rows,
                check: 2
            });

        });
});

//adding new customer
router.get('/newC/adding', function(req, res, next) {

    db.query('INSERT INTO customer (Rating, creditcardnum, customerID) ' +
        'VALUES (?,?,?) ',
        function (err, rows) {
            if (err) throw err;
            console.log("----")
            console.log(rows);
            res.render('customer', {
                title: 'Customer Info',
                newCust: rows,
                check: 2
            });

        });
});

router.get('/newC/adding/:SSN', function (req, res) {
    res.render('index');
})




module.exports = router;