var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/* GET users listing. */
router.get('/', auth, function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/:id/', auth, function (req, res) {

    db.query('SELECT * FROM person ' +
        'LEFT JOIN customer ON person.SSN = customer.CustomerID ' +
        'WHERE person.SSN = ?', [req.params.id], function (err, rows) {

        /**
         * Get Best Sellers List
         */
        db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, COUNT(s.itemID) AS NumberSold ' +
            'FROM item AS i ' +
            'INNER JOIN sales AS s ' +
            'ON i.ItemID = s.ItemID ' +
            'WHERE s.SellerID = ? ' +
            '   GROUP BY s.ItemID ' +
            'ORDER BY NumberSold DESC', [req.params.id],
            function (err, best) {

                if (err) {
                    res.end('temporary error page');
                    return;
                }

                res.render('user', {
                    title: 'Best Sellers',
                    user: req.user,
                    person: rows[0],
                    rows: best
                });
            }
        );


    });


});

module.exports = router;
