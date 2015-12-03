var express = require('express');
var router = express.Router();

var mysql = require("mysql");

// database connection
var db = require('../database.js').db;
var auth = require('../database.js').auth;

var passport = require('passport');

/* Get home page */
router.get('/', auth, function (req, res, next) {

    // get list of auctions and pass it to "index" template
    db.query('SELECT * FROM auction ' +
        'INNER JOIN item on auction.ItemID = item.ItemID ' +
        'INNER JOIN post on auction.AuctionID = post.AuctionID ' +
        'ORDER BY ExpireDate',
        function(err, rows){
          //  if(err) console.log(err);

            res.render('index', {
                title: 'Big Data Auction House',
                auctions: rows,
                user: req.user
            });
        }
    );
});



router.get('/login', function (req, res) {
    if (req.user)
        res.redirect('/');
    else
        res.render('login', {
            message: req.flash('error'),
            register: req.query.reg ? true : false,
            title: 'Login - Big Data'
        });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/register', function (req, res) {
    if (req.body.SSN == '' || req.body.Email == '') {
        return res.render('register', {
            title: 'Register',
            message: 'Error - ID/SSN and Email are both required.'
        });
    }
    db.query('INSERT INTO person ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.SSN, req.body.LastName, req.body.FirstName, req.body.Address, req.body.ZipCode, req.body.telephone, req.body.email, req.body.password],
        function(err){
            if (err) {
                res.render('register', {
                    title: 'Register',
                    message: 'Error - ' + err
                });
            } else {
                res.redirect('/login?reg=true');
            }
        }
    );
});

module.exports = router;
