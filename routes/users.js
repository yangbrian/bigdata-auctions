var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/* GET users listing. */
router.get('/', auth, function (req, res, next) {
    res.send('respond with a resource');
});

/**
 * User Profile Page
 *
 * Table informatino is loaded via AJAX calls (see other functions)
 */
router.get('/:id(\\d+)/', auth, function (req, res) {

    db.query('SELECT * FROM person ' +
        'LEFT JOIN customer ON person.SSN = customer.CustomerID ' +
        'WHERE person.SSN = ?', [req.params.id], function (err, rows) {


            if (err) {
                res.end('temporary error page');
                return;
            }

            res.render('user', {
                title: 'Best Sellers',
                user: req.user,
                person: rows[0]
            });
        }


    );


});
/**
 * Get Best Sellers List
 */
router.get('/:id/best/', auth, function (req, res) {

    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, COUNT(i.Name) AS NumberSold ' +
        'FROM item AS i ' +
        'INNER JOIN sales AS s ' +
        '   ON i.ItemID = s.ItemID ' +
        'WHERE s.SellerID = 222 ' +
        'GROUP BY i.Name ' +
        'ORDER BY NumberSold DESC', [req.params.id],
        function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});

/**
 * Get User Auctions
 */
router.get('/:id/auctions/', auth, function (req, res) {

    db.query('SELECT auction.AuctionID, auction.BidIncrement, auction.MinimumBid, auction.CopiesSold, auction.Monitor, auction.ItemID, bid.CustomerID AS BuyerID, post.CustomerID AS SellerID, item.Description, item.Name, item.Type ' +
        'FROM bid, auction, post, item ' +
        'WHERE ' +
        '   (auction.ItemID = item.ItemID) AND (' +
        '   (bid.AuctionID = auction.AuctionID AND bid.CustomerID = ?) OR ' +
        '   (auction.AuctionID = post.AuctionID AND post.CustomerID = ?) ) ' +
        'GROUP BY AuctionID ' +
        'ORDER BY BuyerID, SellerID', [req.params.id, req.params.id],
        function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    );
});

/**
 * Get Items being auctioned or already by user
 * (Not one of the transactions exactly but we had it so why not)
 */
router.get('/:id/auctions/items/', auth, function (req, res) {
    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, i.NumCopies, a.AuctionID, a.BidIncrement, a.MinimumBid, a.CopiesSold, a.Monitor ' +
        'FROM post p ' +
        'INNER JOIN auction AS a ' +
        '   ON p.AuctionID = a.AuctionID ' +
        'INNER JOIN item AS i ' +
        '   ON a.ItemID = i.ItemID ' +
        'WHERE p.CustomerID = ?', [req.params.id],
        function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    )
});

/**
 * Get Items sold by user
 */
router.get('/:id/items/', auth, function (req, res) {
    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, i.NumCopies, a.AuctionID, a.BidIncrement, a.MinimumBid, a.CopiesSold, a.Monitor ' +
        'FROM sales s ' +
        'INNER JOIN auction AS a ' +
        '   ON s.AuctionID = a.AuctionID ' +
        'INNER JOIN item AS i ' +
        '   ON a.ItemID = i.ItemID ' +
        'WHERE s.SellerID = ?', [req.params.id],
        function (err, rows) {

            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(rows));

        }
    )
});

/**
 * Personalized item suggestion list for the current user
 */
router.get('/suggest/', auth, function (req, res) {
    console.log("Test");
    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type ' +
        'FROM item AS i ' +
        'WHERE i.NumCopies > 0 AND i.Type IN ( ' +
        '    SELECT i.Type ' +
        '        FROM item AS i ' +
        '        INNER JOIN sales AS s ' +
        '            ON i.ItemID = s.ItemID ' +
        '    WHERE s.BuyerID = ? ' +
        ') AND i.ItemID NOT IN ( ' +
        '     SELECT i.ItemID ' +
        '          FROM item AS i ' +
        '          INNER JOIN sales AS s ' +
        '               ON i.ItemID = s.ItemID ' +
        '     WHERE s.BuyerID = 222 ' +
        ')', [req.user.SSN], function (err, rows) {

            res.render('suggest', {
                title: 'Personalized Item Suggestion List',
                user: req.user,
                items: rows
            })
        }
    );
});


module.exports = router;
