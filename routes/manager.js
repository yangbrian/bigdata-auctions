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


module.exports = router;
