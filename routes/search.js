var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/**
 * Base search results page
 *
 * Table informatino is loaded via AJAX calls (see other functions)
 */
router.get('/', auth, function (req, res) {

    res.render('search', {
        title: 'Search Results',
        search: req.query.search
    });

});

/**
 * Items available with a particular keyword or set of keywords in the item name, and corresponding auction info
 */
router.get('/:keyword/name/', auth, function (req, res) {

    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, i.NumCopies, a.AuctionID, a.BidIncrement, a.MinimumBid, a.CopiesSold, a.Monitor ' +
        'FROM item i ' +
        'INNER JOIN auction AS a ' +
        '   ON i.ItemID = a.ItemID ' +
    'WHERE i.Name LIKE ?', ['%' + req.params.keyword + '%'],
        function (err, rows) {

            if (err)
                console.log(err);

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});

/**
 * Items available with a particular keyword or set of keywords in the item name, and corresponding auction info
 */
router.get('/:type/type/', auth, function (req, res) {

    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, i.NumCopies, a.AuctionID, a.BidIncrement, a.MinimumBid, a.CopiesSold, a.Monitor ' +
        'FROM item i ' +
        'INNER JOIN auction AS a ' +
        '   ON i.ItemID = a.ItemID ' +
        'WHERE i.type = ?', [req.params.type],
        function (err, rows) {

            if (err)
                console.log(err);

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});

module.exports = router;
