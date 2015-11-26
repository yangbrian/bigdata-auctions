var express = require('express');
var router = express.Router();

var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "serv.byang.io",
    user: "root",
    password: "goseawolves2015",
    database: 'test'
});

/* Get home page */
router.get('/', function (req, res, next) {

    // get list of auctions and pass it to "index" template
    con.query('SELECT * FROM auction', function(err, rows){
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
router.get('/auction/:id', function (req, res) {
    con.query(
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

module.exports = router;
