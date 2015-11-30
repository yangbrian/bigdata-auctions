var express = require('express');
var router = express.Router();

var mysql = require("mysql");

// database connection
var db = require('../database.js').db;

/* Get home page */
router.get('/', function (req, res, next) {

    // get list of auctions and pass it to "index" template
    db.query('SELECT * FROM auction ' +
        'INNER JOIN item on auction.ItemID = item.ItemID ' +
        'INNER JOIN post on auction.AuctionID = post.AuctionID ' +
        'ORDER BY ExpireDate',
        function(err, rows){
            if(err) throw err;

            res.render('index', {
                title: 'Big Data Auction House',
                auctions: rows
            });
        }
    );
});

module.exports = router;
