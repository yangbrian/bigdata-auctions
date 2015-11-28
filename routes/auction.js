var express = require('express');
var router = express.Router();

var db = require('../database.js').db;

/* Get home page */
router.get('/', function (req, res, next) {

    // get list of auctions and pass it to "index" template
    db.query('SELECT * FROM auction', function(err, rows){
        if(err) throw err;

        res.render('index', {
            title: 'Big Data Auction House',
            auctions: rows
        });
    });
});

/**
 * Get Auction by ID and display the listing page
 */
router.get('/:id', function (req, res) {
    db.query(
        'SELECT * FROM auction ' +
        'INNER JOIN item ' +
        'ON auction.ItemID = item.ItemID ' +
        'WHERE AuctionId=' + req.params.id,

        function(err, rows) {

            if (err || rows.length == 0) {
                res.end('temporary error page - no such auction by id ' + req.params.id);
                return;
            }

            res.render('auction', {
                title: 'Viewing Auction ' + req.params.id,
                auction: rows[0] // should only return one row
            });
        }
    );


});

/**
 * POST Request to create a new auction
 *
 * Form data will contain:
 *    - Item Name
 *    - Item Type
 *    - Item Quantity
 *    - Minimum Bid
 *    - Bid Increment
 */
router.post('/new', function (req, res) {
    res.send(req.body.id);




});

module.exports = router;
