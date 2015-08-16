var express = require('express');
var router =  require("./router");
var app = express();
var port = process.env.PORT || 5000

app.use('/api',router);
app.use(express.static(__dirname + '/../web/'));

app.listen(port);
console.log('App server started on port '+port);