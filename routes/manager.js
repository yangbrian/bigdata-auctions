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
 * Comprehensive list of all items
 */
router.get('/items/', auth, function (req, res) {
    db.query('SELECT * FROM item', function (err, items) {
        res.render('items', {
            title: 'All Items ',
            items: items,
            user: req.user
        })
    })
});



//editing a employee
router.post('/employee/edit/', function (req, res, next) {

    db.query('UPDATE employee ' +
        'SET StartDate = ?, HourlyRate = ?, Level = ?' +
        'WHERE EmployeeID =  ?',
        [req.body.StartDate, req.body.HourlyRate, req.body.Level, req.body.EmployeeID],
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
 * Determine which customer representative generated most total revenue
 */
router.get('/revenue/best/reps', auth, function (req, res) {

    db.query('SELECT * FROM ( ' +
        'SELECT P.SSN, P.FirstName, P.LastName, Sum(S.Price) AS TotalRevenue ' +
        'FROM Sales S, Auction A, Person P ' +
        'WHERE S.AuctionID = A.AuctionID AND A.Monitor = P.SSN ' +
        'GROUP BY P.SSN ' +
        'ORDER BY TotalRevenue) T1 ' +
        'WHERE TotalRevenue >= ALL ( ' +
        '   SELECT Sum(S.Price) AS TotalRevenue ' +
        '       FROM Sales S, Auction A, Person P ' +
        '       WHERE S.AuctionID = A.AuctionID AND A.Monitor = P.SSN ' +
        '   GROUP BY p.SSN ' +
        '   ORDER BY TotalRevenue' +
        ')', function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});

/**
 * Determine which customers generated most total revenue
 */
router.get('/revenue/best/customers', auth, function (req, res) {

    db.query('SELECT * FROM ( ' +
        'SELECT P.SSN, P.FirstName, P.LastName, Sum(S.Price) AS TotalRevenue ' +
        '   FROM Sales S, Person P ' +
        '   WHERE S.SellerID = P.SSN ' +
        '   GROUP BY S.SellerID ORDER BY TotalRevenue) Revenue ' +
        '   WHERE TotalRevenue >= ALL ( ' +
        '       SELECT Sum(S.Price) AS TotalRevenue ' +
        '           FROM Sales S, Person P ' +
        '           WHERE S.SellerID = P.SSN ' +
        '       GROUP BY S.SellerID ' +
        '       ORDER BY TotalRevenue ' +
        ')', function (err, rows) {

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
        user: req.user,
        check : 1
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


router.get('/employee/get/:employee', function (req, res) {
    db.query('SELECT * from employee WHERE EmployeeID=?', [req.params.employee],
        function (err, rows) {
            var data = {};
            if (rows.length > 0) {
                data = {
                    success: true,
                    employee: rows[0]
                }
            } else {
                data = {
                    success : false
                }
            }


            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(data));
        })
});

//deleting a employee
router.post('/employee/:EmployeeID', function (req, res, next) {

    db.query('DELETE FROM employee ' +
        'WHERE EmployeeID = ' + req.params.EmployeeID,
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




//adding new employee
router.get('/employee/new', function (req, res, next) {

    db.query('SELECT * FROM person ' +
        'LEFT JOIN employee on EmployeeID = person.SSN ' +
        'LEFT JOIN customer on customerID = person.SSN ',
        function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        });
});


//adding new employee
router.post('/employee/', function (req, res, next) {

    db.query('INSERT INTO employee (StartDate, HourlyRate, Level, EmployeeID) ' +
        'VALUES (?,?,?,?) ',
        [req.body.StartDate, req.body.HourlyRate, req.body.Level, req.body.EmployeeID],
        function (err, rows) {
            var data = {};
            if (err) {
                console.log("ERROR - " + err);
                data.success = false;
            } else {
                data.success = true;
            }
        });

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(data));
});



module.exports = router;
