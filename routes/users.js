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
router.get('/:id/', auth, function (req, res) {

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

    db.query('SELECT i.ItemID, i.Description, i.Name, i.Type, ' +
        'COUNT(s.itemID) AS NumberSold ' +
        'FROM item AS i ' +
        'INNER JOIN sales AS s ' +
        'ON i.ItemID = s.ItemID ' +
        'WHERE s.SellerID = ? ' +
        '   GROUP BY s.ItemID ' +
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

module.exports = router;
