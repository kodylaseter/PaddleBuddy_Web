// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var Point = require('./public/models/point');

// configuration =================

mongoose.connect('mongodb://kodylaseter:manhunt1@ds047712.mongolab.com:47712/pbdb');     // connect to mongoDB database

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.set('port', process.env.PORT || 8080);

//ROUTES
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

// api ---------------------------------------------------------------------
app.get('/api/point', function(req, res) {

    // use mongoose to get all todos in the database
    Point.find(function(err, points) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(points); // return all todos in JSON format
    });
});

app.listen(8080);
console.log("App listening on port 8080");