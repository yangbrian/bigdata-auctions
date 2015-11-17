var app = require('express')();

app.get('/', function(err, req, res) {
    return 'Hello world';
});

var server = app.listen(3000, function() {
    console.log("Server started on port 3000");
});
