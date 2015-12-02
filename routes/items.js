var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

router.get('/:name', auth, function (req, res) {
        db.query(
            'SELECT * FROM Item', function (err, items) {

                db.query(
                    'SELECT Person.FirstName, Person.LastName, Item.Name AS ItemName, Sales.Price ' +
                    'FROM Sales ' +
                    'INNER JOIN Item ' +
                    'ON Sales.ItemID = Item.ItemID ' +
                    'INNER JOIN Person ' +
                    'ON Sales.BuyerID = Person.SSN ' +
                    'Where Name = ? ', [req.params.name], function (err, bestItems) {
                        res.render('items', {
                            title: 'Items ',
                            items: items,
                            bestSeller: bestItems

                        })
                    })
            })
    }
);

router.get('/:ItemID', auth, function (req, res) {
    db.query
    {
        'SELECT item.itemID, item.Type, item.Name, sum(sales.price) as Revenue ' +
        'FROM item ' +
        'INNER JOIN sales ' +
        'ON item.ItemID = sales.ItemID ' +
        'WHERE item.ItemID=?', [req.params.ItemID],
            'GROUP BY item.ItemID', function (err, rows) {
            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));
        }
    }
})


    module.exports = router;