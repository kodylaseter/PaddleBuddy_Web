// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var mysql = require('mysql');

// configuration =================

//mongoose.connect('mongodb://kodylaseter:manhunt1@ds047712.mongolab.com:47712/pbdb');     // connect to mongoDB database

var connection = mysql.createConnection({
    host: 'www.db4free.net',
    user: 'kodylaseter',
    password: 'password',
    database: 'pb_test'
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

app.get('/api/rivers', function(req, res) {
    connection.query('SELECT * from river', function(error, rows, fields) {
        if (error) res.send(error);
        else {
            console.log('Successfuly got rivers');
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/rivers', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    console.log('Adding river: ' + data.name);
    connection.query('INSERT INTO river SET ?', data, function(error) {
        if (error) res.send(error);
        else {
            connection.query('SELECT * from river', function(error, rows, fields) {
                if (error) res.send(error);
                else {
                    res.send(JSON.stringify(rows));
                }
            });
        }
    })
});

app.get('/api/points/:river_id', function(req, res) {
    connection.query('SELECT * FROM point where river_id = ?;', req.params.river_id, function(error, rows, fields) {
        if (error) res.send(error);
        else {
            //console.log(rows);
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/points', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    var riverID = data.river_id;
    var query = connection.query('INSERT INTO point SET ?', data, function(error) {
        if (error) res.send(error);
        else {
            var pointID = query._results[0].insertId;
            var check = connection.query('SELECT * FROM link WHERE begin = ? OR end = ? OR river = ?', [pointID, pointID, riverID], function(error, rows) {
                if (error) res.send(error);
                else {
                    console.log(rows);
                }
            });
            res.send('Success');
        }
    });
});

app.delete('/api/points/:point_id', function(req, res) {
    connection.query('DELETE FROM point WHERE id = ?;', req.params.point_id, function(error) {
        if (error) res.send(error);
        else res.send('Success');
    })
});

//launch server--------------------------------------------
app.listen(4000, '0.0.0.0');
console.log("App listening on port 4000");