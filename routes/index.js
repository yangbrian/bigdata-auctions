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
            rows: rows
        });
    });
});

module.exports = router;
