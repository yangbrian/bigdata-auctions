var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/**
 * Manager Dashboard
 */
router.get('/', auth, function (req, res) {

    res.render('manager', {
        title: 'Manager Dashboard',
        user: req.user
    })


});

/**
 * Get Best Sellers List
 */
router.get('/best/', auth, function (req, res) {

    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, COUNT(i.Name) AS NumberSold ' +
        'FROM item AS i ' +
        'INNER JOIN sales AS s ' +
        '   ON i.ItemID = s.ItemID ' +
        'GROUP BY i.Name ' +
        'ORDER BY NumberSold DESC', [req.params.id],
        function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});



/**
 * BELOW IS ADD, EDITING, DELETING EMPLOYEE
 */
router.get('/employee', auth, function (req, res) {

    res.render('employee', {
        title: 'Manager Dashboard',
        user: req.user
    })


});



//getting list of employee
router.get('/employee/get', function (req, res, next) {

    db.query('SELECT * FROM person ' +
        'INNER JOIN employee on person.SSN = employee.EmployeeID',
        function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );

});


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


module.exports = router;
