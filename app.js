var app = require('express')();
var sql = require('mysql');

var con = sql.createConnection({
    host: 'serv.byang.io',
    user: 'root',
    password: 'goseawolves2015',
    database: 'test'
});

app.get('/', function(err, req, res) {
    con.query('SHOW TABLES', function(err, rows) {
        console.log(rows);
    });
    return 'Hello world';
});

var server = app.listen(3000, function() {
    console.log("Server started on port 3000");
});
