var express = require('express');
var router =  require("./router");
var app = express();
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.use('/api',router);
app.use(express.static(__dirname + '/../web/'));

app.listen(port,ip_address);
console.log('App server started on port '+port);