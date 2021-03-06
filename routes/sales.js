var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/**
 * Load sales/revenue search page
 * All data loaded via Ajax
 */
router.get('/', auth, function (req, res) {
    res.render('items', {
        user: req.user,
        sales: true,
        title: 'Sales and Revenue',
        search: req.query.search
    })
});

/**
 * List of sales by customer last name
 */
router.get('/customer/:name', auth, function (req, res) {

    db.query(
        'SELECT CONCAT(Person.FirstName, " ", Person.LastName) as CustomerName, Item.Name AS ItemName, Item.Type, Sales.Price, Sales.Date ' +
        'FROM Sales ' +
        'INNER JOIN Item ' +
        'ON Sales.ItemID = Item.ItemID ' +
        'INNER JOIN Person ' +
        'ON Sales.BuyerID = Person.SSN ' +
        'Where CONCAT(Person.FirstName, " ", Person.LastName) = ? ', [req.params.name], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    );
});

/**
 * Revenue generated by customer name
 */
router.get('/revenue/customer/:name', auth, function (req, res) {

    db.query(
        'SELECT CONCAT(Person.FirstName, " ", Person.LastName) as CustomerName, Item.Name AS ItemName, Item.Type, sum(Sales.Price) as Revenue ' +
        'FROM Sales ' +
        'INNER JOIN Item ' +
        'ON Sales.ItemID = Item.ItemID ' +
        'INNER JOIN Person ' +
        'ON Sales.BuyerID = Person.SSN ' +
        'Where CONCAT(Person.FirstName, " ", Person.LastName) = ? ' +
        'GROUP BY CustomerName', [req.params.name], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    );
});

/**
 * List of sales by item name
 */
router.get('/item/:name', auth, function (req, res) {
    db.query
    (
        'SELECT item.itemID, item.Type, item.Name, sales.Price, sales.Date ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.Name=? ' +
            'GROUP BY item.ItemID', [req.params.name], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    )
});

/**
 * Revenue generated by item name
 */
router.get('/revenue/item/:name', auth, function (req, res) {
    db.query
    (
        'SELECT item.itemID, item.Type, item.Name, sum(sales.Price) as Revenue ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.Name=? ' +
        'GROUP BY item.Name', [req.params.name], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    )
});

/**
 * List of sales by item name
 */
router.get('/type/:type', auth, function (req, res) {
    db.query
    (
        'SELECT item.itemID, item.Type, item.Name, sales.Price, sales.Date ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.Type=? ' +
        'GROUP BY item.ItemID', [req.params.type], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    )
});

/**
 * Revenue generated by item type
 */
router.get('/revenue/type/:type', auth, function (req, res) {
    db.query
    (
        'SELECT item.itemID, item.Type, item.Name, sum(sales.Price) as Revenue ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.Type=? ' +
        'GROUP BY item.Type', [req.params.type], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    )
});

/**
 * Revenue generated by item type
 */
router.get('/revenue/type/:type', auth, function (req, res) {
    db.query
    (
        'SELECT item.itemID, item.Type, item.Name, sum(sales.Price) as Revenue ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.Type=? ' +
        'GROUP BY item.Type', [req.params.type], function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    )
});

/**
 * Sales report for a particular month
 */
router.get('/month/', auth, function (req, res) {
    db.query
    (
        'SELECT Sales.SellerID, Sales.BuyerID, Sales.ItemID, Item.Name, Sales.Price, Sales.Date ' +
        'FROM Sales, Item ' +
        'WHERE Month(`Date`) = ? AND Year(`Date`) = ? ' +
        'AND Item.ItemID = Sales.ItemID ' +
        'ORDER BY Date DESC', [req.query.month, req.query.year], function (err, rows) {
        res.render('sales', {
            title: 'Sales Report for ' + req.query.month + '/' + req.query.year,
            user: req.user,
            sales: rows,
            monthyear: req.query.month + '/' + req.query.year
        });
        }
    )
});


module.exports = router;