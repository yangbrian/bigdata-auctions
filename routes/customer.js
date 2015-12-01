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
                customers: rows
            });
        }
    );

});

//editing a customer
router.get('/', function (req, res, next){

    db.query('UPDATE customer',
        'SET Rating = ?, creditcardnum = ?, ',
        'WHERE customerID = ?' ,
        [req.body.Rating, req.body.creditcardnum, req.params.customerID],
        function(err, rows){
            if(err)throw err;

        })

});

//deleting a customer
router.get('/', function(req, res, next){

    db.query('DELETE FROM customer',
        'WHERE customerID = ' +req.params.customerID,
        function(err, rows){
            if(err)throw err;

        })
})

//adding new customer
router.get('/newC', function(req, res, next) {

    db.query('INSERT INTO person (SSN, LastName, FirstName, Address, ZipCode, telephone, email) ' +
        'VALUES(?, ?, ?, ?, ?, ?, ?)',
        [req.body.SSN, req.body.LastName, req.body.FirstName, req.body.Address, req.body.ZipCode, req.body.telephone, req.body.email],
        function (err, rows) {
            if (err) throw err;
            var SSN = req.body.SSN;

            db.query('INSERT INTO customer (Rating, creditcardnum, CustomerID ' +
                'VALUES(?,?,?)',
                [req.body.Rating, req.body.creditcardnum, SSN],
                function (err, rows) {
                    if (err) throw err;

                })

        });
});


module.exports = router;