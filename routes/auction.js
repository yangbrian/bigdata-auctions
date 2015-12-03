var express = require('express');
var router = express.Router();

var db = require('../database.js').db;
var auth = require('../database.js').auth;

/* /auction home page */
router.get('/', auth, function (req, res, next) {

    res.send('This page does nothing right now. Please enter an ID');
});

/**
 * Get Auction by ID and display the listing page
 */
router.get('/:id', auth, function (req, res) {
    db.query(
        'SELECT * FROM auction ' +
        'INNER JOIN item ON auction.ItemID = item.ItemID ' +
        'INNER JOIN post ON auction.AuctionID = post.AuctionID ' +
        'WHERE auction.AuctionId=' + req.params.id,

        function (err, rows) {

            if (err || rows.length == 0) {
                res.end('temporary error page - no such auction by id ' + req.params.id);
                return;
            }

            db.query('SELECT bid.CustomerID, bid.BidTime, bid.BidPrice ' +
                'FROM bid ' +
                'WHERE bid.AuctionID = ? ORDER BY bid.BidTime DESC', [req.params.id], function (err, bids) {

                    res.render('auction', {
                        title: 'Viewing Auction ' + req.params.id,
                        user: req.user,
                        auction: rows[0], // should only return one row
                        bids: bids,
                        post: req.query.post ? true : false // show the new auction success alert
                    }

                );
            });


        }
    );


});

/**
 * POST Request to create a new auction
 *
 * Form submits here and data is in req.body.hello
 * Where hello is the value of the HTML 'name' attribute of each input field
 *
 */
router.post('/new', auth, function (req, res) {
    // first add the item
    db.query('INSERT INTO item (Description, Name, Type, NumCopies)' +
        'VALUES (?, ?, ?, ?)', [req.body.description, req.body.name, req.body.type, req.body.copies],
        function (err, rows) {

            // TEMPORARY HARDCODED EMPLOYEE
            req.body.monitor = 1;
            req.body.customer = req.user.SSN;

            // to group:
            // this callback function is executed when the query is complete,
            // and so on for the ones below

            // item ID is auto-incremented. Select LAST_INSERT_ID gets that ID
            // might run into concurrency issues but its fine for this project
            db.query('SELECT LAST_INSERT_ID()', function (err, rows) {

                // id of newly inserted item
                var id = rows[0]['LAST_INSERT_ID()'];

                // add auction of that item
                db.query('INSERT INTO auction (BidIncrement, MinimumBid, CopiesSold, Monitor, ItemID)' +
                    'VALUES (?, ?, ?, ?, ?)',
                    [req.body.increment, req.body.minimum, req.body.copies, req.body.monitor, id],
                    function (err, rows) {

                        // I don't like how he made us organize this database...
                        db.query('SELECT LAST_INSERT_ID()', function (err, rows) {

                            // same deal as above but with new auction
                            id = rows[0]['LAST_INSERT_ID()'];

                            // insert auction into the post table, indicating who is posting the auction
                            db.query('INSERT INTO post VALUES (?, ?, ?, NOW(), ?)',
                                [req.body.customer, id, req.body.expire, req.body.reserve],
                                function (err, rows) {
                                    var data = {};

                                    if (err) {
                                        console.log("ERROR - Error inserting auction");
                                        console.log(err);
                                        data.success = false;

                                    } else {
                                        data.success = true;
                                        data.id = id; // send the id so the page can redirect
                                    }

                                    res.setHeader('content-type', 'application/json');
                                    return res.send(JSON.stringify(data));
                                }
                            ); // end insert post query
                        }); // end get auction ID query
                    }
                ); // end insert auction query
            }); // end get item ID query
        }
    ); // end insert item query
});

router.post('/bid/:id', auth, function (req, res) {

    db.query('INSERT INTO bid VALUES (?, ?, ?, NOW(), ?)',
        [req.user.SSN, req.params.id, req.body.item, req.body.price],
        function (err, rows) {
            var data = {};
            if (err) {
                console.log("ERROR - " + err);
                data.success = false;
            } else {
                data.success = true;
            }


            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(data));
        }
    );
});

/**
 * Sell the current item
 */
router.post('/sell/', auth, function (req, res) {
    db.query('INSERT INTO sales ' +
        'VALUES(?, ?, ?, NOW(), ?, ?)',
        [req.body.buyer, req.body.seller, req.body.price, req.body.item, req.body.auction] ,
        function (err, rows) {

            var data = {};
            if (err) {
                console.log("ERROR - " + err);
                data.success = false;
            } else {
                data.success = true;
            }


            res.setHeader('content-type', 'application/json');
            return res.send(JSON.stringify(data));

        }
    );
});

module.exports = router;
