// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var mysql = require('mysql');
var linq = require('linq');

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

app.get('/api/web/rivers', function(req, res) {
    connection.query('SELECT * from river', function(error, rows, fields) {
        if (error) res.send(error);
        else {
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/web/rivers', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
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

app.get('/api/web/points/:river_id', function(req, res) {
    connection.query('SELECT * FROM point where river_id = ?;', req.params.river_id, function(error, rows, fields) {
        if (error) res.send(error);
        else {
            res.send(JSON.stringify(rows));
        }
    });
});

app.post('/api/web/points', function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    var prevPointID = data[0];
    var point = data[1];
    var riverID = point.river_id;
    var query = connection.query('INSERT INTO point SET ?', point, function(error) {
        if (error) res.send(error);
        else {
            var pointID = query._results[0].insertId;
            //var check = connection.query('SELECT * FROM link WHERE river = ?', [riverID], function(error, rows) {
            var check = connection.query('SELECT COUNT(*) as count FROM link WHERE river = ?', riverID, function(error, result) {
                if (error) res.send(error);
                else {
                    if (result.length < 1) {
                        res.send('First point for this id, no link added');
                    }
                    else {
                        var link = {
                            begin: prevPointID,
                            end: pointID,
                            speed: 1,
                            river: riverID
                        };
                        var test = connection.query('INSERT INTO link SET ?', link, function(error) {
                            if (error) res.send(error);
                            else {
                                res.send('Success');
                            }
                        })
                    }
                }
            });
        }
    });
});

app.delete('/api/web/points/:point_id', function(req, res) {
    connection.query('DELETE FROM point WHERE id = ?;', req.params.point_id, function(error) {
        if (error) res.send(error);
        else res.send('Success');
    })
});

app.get('/api/mobile/river/:id', function(req, res) {
    connection.query('SELECT * FROM point WHERE river_id = ?', req.params.id, function(error, rows) {
        var response = {};
        if (error) {
            response.success = false;
            response.detail = error;
        } else {
            response.success = true;
            var data = {};
            data.id = req.params.id;
            data.points = rows;
            response.data = data;
        }
        res.send(response);
    });
});

app.post('/api/mobile/closest_river', function(req, res) {
    var point = JSON.parse(JSON.stringify(req.body));
    //source http://stackoverflow.com/a/5933294
    var query = 'SELECT river_id ,((ACOS(SIN(' + point.Lat + ' * PI() / 180) * SIN(`lat` * PI() / 180) + COS(' + point.Lat + ' * PI() / 180) * COS(`lat` * PI() / 180) * COS((' + point.Lng + ' - `lng`) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) AS `distance` FROM `point` WHERE (`lat` BETWEEN (' + point.Lat + ' - ' + 2 + ') AND (' + point.Lat + ' + ' + 2 + ') AND `lng` BETWEEN (' + point.Lng + ' - ' + 2 + ') AND (' + point.Lng + ' + ' + 2 + ')) ORDER BY `distance` ASC limit 1;';
    var response = {};
    connection.query(query, function(error, rows) {
        if (error) {
            res.send(error);
        } else {
            if (rows.length < 1) {
                response.success = false;
                response.detail = 'No rows returned!';
                res.send(response);
            } else {
                connection.query('SELECT * FROM point WHERE river_id = ?', rows[0].river_id, function(error, rows) {
                    if (error) {
                        response.success = false;
                        response.detail = error;
                    } else {
                        response.success = true;
                        var data = {};
                        data.id = rows[0].river_id;
                        data.points = rows;
                        data.name = rows[0].name;
                        response.data = data;
                    }
                    res.send(response);
                });
            }
        }
    });
});

app.get('/api/mobile/rivers', function(req, res) {
    connection.query('SELECT * from river', function(error, rows, fields) {
        var response = {};
        if (error) {
            response.success = false;
            response.detail = error;
        }
        else {
            response.success = true;
            response.data = rows;
        }
        res.send(response);
    });
});

app.get('/api/mobile/estimate_time', function(req, res) {
    var id1 = req.headers.p1;
    var id2 = req.headers.p2;
    var response = {};
    //connection.query('SELECT river_id FROM point WHERE id IN (?, ?)', [id1, id2], function(error, rows) {
    //    console.log(rows);
    //    if (error) {
    //        response.success = false;
    //        response.detail = error;
    //    } else if (!rows || rows.length < 2) {
    //        response.success = false;
    //        response.detail = "1 or fewer river ids returned";
    //    } else if (rows[0].river_id != rows[1].river_id) {
    //        response.success = false;
    //        response.detail = "river ids don't match";
    //    } else {
    //        var river_id = rows[0].river_id;
    //        connection.query('SELECT id, lat, lng FROM point WHERE river_id = ?', river_id, function(error, rows) {
    //            if (error) {
    //                response.success = false;
    //                response.detail = error;
    //            } else {
    //                connection.query('SELECT * FROM link WHERE river_id = ?', river_id, function(error, rows) {
    //                    if (error) {
    //                        response.success = false;
    //                        response.detail = error;
    //                    } else {
    //                        //http://stackoverflow.com/questions/13948407/mysql-replace-foreign-key-in-result-table-with-data-from-fk-table
    //                    }
    //                })
    //            }
    //        });
    //    }
    //    res.send(response);
    //});
    connection.query('select l.*, p1.*, p2.* from pb_test.link l inner join (select lat as begin_lat, lng as begin_lng, id as begin_id from pb_test.point) p1 on l.begin = p1.begin_id inner join (select lat as end_lat, lng as end_lng, id as end_id from pb_test.point) p2 on l.end = p2.end_id', function(error, rows) {
        if (error) {
            response.success = false;
            response.detail = error;
        } else {
            
        }
        res.send(response);
    });
});

app.get('/api/mobile/*', function(req, res) {
    res.send({
        success: false,
        detail: "Failed to hit any api endpoints!"
    });
});

//launch server--------------------------------------------
app.listen(4000, '0.0.0.0');
console.log("App listening on port 4000");