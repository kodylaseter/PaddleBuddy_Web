// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
//var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var mysql = require('mysql');
//var Point = require('./public/models/point');
//var River = require('./public/models/river');

// configuration =================

//mongoose.connect('mongodb://kodylaseter:manhunt1@ds047712.mongolab.com:47712/pbdb');     // connect to mongoDB database

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'pb'
});

app.use(require('connect-livereload')({port: 35729}));
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.set('port', process.env.PORT || 8080);

//ROUTES

//connection.connect();
//connection.query('SELECT * from point', function(error, rows, fields) {
//    if (!error) console.log(rows);
//    else console.log(error);
//});
//
//connection.end();

app.get('/api/rivers', function(req, res) {
    connection.query('SELECT * from river', function(error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/rivers', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    connection.query('INSERT INTO river SET ?', data, function(error) {
        if (error) console.log(err);
        else res.send('success');
    })
});

app.get('/api/points', function(req, res) {
    connection.query('SELECT * from point', function(error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(JSON.stringify(rows));
        }
    });
});

app.get('/api/points/:river_id', function(req, res) {
    var id = req.params.river_id;
    connection.query('SELECT * FROM point where river_id = ?;', id, function(error, rows) {
        if (error) console.log(error);
        else {
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/points', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    for (var i = 0; i < data.length; i++) {
        connection.query('INSERT INTO point SET ?', data[i], function(error) {
            if (error) console.log('error');
        });
    }
});
//
//app.get('/api/points', function(req, res) {
//    Point.find(function(err, points) {
//        console.log('points get called');
//        if (err)
//            res.send(err);
//        res.json(points);
//    });
//});
//
//app.post('/api/points', function(req, res) {
//    for (var i = 0; i < req.body.length; i++) {
//        Point.create({
//            lat: req.body[i].lat,
//            lng: req.body[i].lng
//        }, function(err, point) {
//            if (err) res.send(err);
//        });
//    }
//});
//
//app.get('*', function(req, res) {
//    res.sendFile(__dirname + '/public/index.html');
//});

//launch server--------------------------------------------
app.listen(4000, '0.0.0.0');
console.log("App listening on port 4000");