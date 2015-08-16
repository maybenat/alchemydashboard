var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var router = express.Router();
var Twitter = require('node-twitter');
 //Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

router.use(bodyParser.urlencoded({extended: true }));
router.use(bodyParser.json());
 
var twitterSearchClient  = new Twitter.SearchClient(
    'qJ0RGVIaVnqqMHENPTOrscMDM',
    'Y0nTypj19dBGFhuiroxgjVFxKR9IwTh2BNgv5vpYxdbSkV961y',
    '125795454-Rfeh6JmmJnNj6ngIG4LdvzOYHaC4DrPdFwxUW3bu',
    'T61j5aM45qeF6qC6OYfzbO5ab59yqXHJHxUDmAXaVU4dM'
);


router.get('/:keyword',function(req, res){
twitterSearchClient.search({'q': req.params.keyword, since:req.query.since, count:100,}, function(error, result) {
    if (error)
    {
        console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
    }
 
    if (result)
    {
		res.json(result);
    }
});
});



module.exports = router; 