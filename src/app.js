var express = require('express');
var router =  require("./router");
var app = express();
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080

app.use('/api',router);
app.use(express.static(__dirname + '/../web/'));

app.listen(port);
console.log('App server started on port '+port);