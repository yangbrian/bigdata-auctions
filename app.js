var app = require('express')();
var sql = require('mysql');

var con = sql.createConnection({
    host: 'serv.byang.io',
    user: 'root',
    password: 'goseawolves2015',
    database: 'test'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(err, req, res) {
    con.query('SHOW TABLES', function(err, rows) {
        console.log(rows);
    });
    res.send('Hello world!');
});

var server = app.listen(3000, function() {
    console.log("Server started on port 3000");
});
