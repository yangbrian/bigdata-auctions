/**
 * Skeleton generated by Express.js generator
 * http://expressjs.com/starter/generator.html
 *
 * Big Data Auction House
 *
 * Albert Ibragimov <albert.ibragimov@stonybrook.edu>
 * Sheryar Shah <sheryar.shah@stonybrook.edu>
 * Brian Yang <brian.yang@stonybrook.edu>
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');
var auction = require('./routes/auction');
var customers = require('./routes/customer');
var db = require('./database.js').db;
var sales = require('./routes/sales');
var search = require('./routes/search');
var manager = require('./routes/manager');


var app = express();
app.use(flash());


app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'catsmeow'
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);
app.use('/auction', auction);
app.use('/customer', customers);
app.use('/manager/sales', sales);
app.use('/search', search);
app.use('/manager', manager);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {


        console.log("TRY");
        db.query('SELECT * FROM person ' +
            'LEFT JOIN customer ON person.SSN = customer.CustomerID ' +
            'LEFT JOIN employee ON person.SSN = employee.EmployeeID ' +
            'WHERE person.email=?', [username], function (err, rows) {
            if (err)
                return done(err);

            if (rows.length == 0) {
                console.log("USER");
                return done(null, false, { message: 'Incorrect username.' });
            }
            if ((rows[0].password == '' && password != 'hello') || password != rows[0].password) {
                console.log("PASS");
                return done(null, false, { message: 'Incorrect password.' });
            }


            console.log("GOOD");
            return done(null, rows[0]);
        });
    }
));

module.exports = app;
