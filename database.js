/* Database Configuration */

var mysql = require("mysql");

// First you need to create a connection to the db
var db = mysql.createConnection({
    host: "mysql-host",
    user: "mysql-user",
    password: "mysql-password",
    database: "mysql-db-name"
});

// check authentication
// for debugging, temporarily will allow all
function auth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports.db = db;
module.exports.auth = auth;
