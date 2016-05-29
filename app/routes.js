/**
 * Created by KodyLaseter on 5/27/2016.
 */

var mysql = require('mysql');
var linq = require('linq');
var geolib = require('geolib');

module.exports = function(app, passport, connection) {
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

    app.post('/api/web/update_point', function(req, res) {
        var data = JSON.parse(JSON.stringify(req.body));
        var isLaunchSite = (data.isLaunchSite == true) ? 1 : 0;
        console.log(data.id);
        var query = 'UPDATE point SET is_launch_site = ' + isLaunchSite.toString() + ', label = "' + data.label.toString() + '" WHERE id = ' + data.id;
        console.log(query);
        connection.query(query, function(error, rows) {
            var response = {};
            if (error) {
                response.success = false;
                response.detail = error;
            } else {
                response.success = true;
                response.detail = "Successfully updated";
            }
            res.send(response);
        });
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

    app.get('/api/mobile/all_rivers', function(req, res) {
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

    app.get('/api/mobile/all_points', function(req, res) {
        connection.query('SELECT * from point', function(error, rows, fields) {
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

    app.get('/api/mobile/all_links', function(req, res) {
        connection.query('SELECT * from link', function(error, rows, fields) {
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
        var response = {};
        var id1 = req.headers.p1;
        var id2 = req.headers.p2;
        var river_id = req.headers.river;
        if (id1 && id2 && river_id) {
            connection.query('select l.*, p1.*, p2.* from link l inner join (select lat as begin_lat, lng as begin_lng, id as begin_id from point) p1 on l.begin = p1.begin_id inner join (select lat as end_lat, lng as end_lng, id as end_id from point) p2 on l.end = p2.end_id where river = ?', river_id, function(error, rows) {
                if (error) {
                    response.success = false;
                    response.detail = error;
                } else {
                    var links = [];
                    var query = 'v => v.begin == ' + id1;
                    var temp = linq.from(rows).where(query).firstOrDefault();
                    var newId, index;
                    if (!temp) {
                        response.success = false;
                        response.detail = "unable to locate first point";
                    } else {
                        //TODO: NEED TO MAKE SURE THIS HANDLES ERRORS
                        while (temp && temp.end != id2) {
                            if (!temp) {
                                response.success = false;
                                response.detail = "Did not reach end point";
                                break;
                            }
                            links.push(temp);
                            newId = temp.end;
                            index = rows.indexOf(temp);
                            rows.splice(index, 1);
                            query = 'v => v.begin == ' + newId;
                            temp = linq.from(rows).where(query).firstOrDefault();
                        }
                        if (temp != null && temp.end == id2) {
                            links.push(temp);
                        }
                        if (links[0].begin == id1 && links[links.length - 1].end == id2) {
                            response.success = true;
                            response.detail = "Full path";
                            var values = linksToTime(links);
                            var time = values[0];
                            var dist = values[1];
                            response.data = {
                                startid: id1,
                                endid: id2,
                                riverID: river_id,
                                time: time,
                                timeunit: "minutes",
                                distance: dist,
                                distanceunit: 'miles'
                            }
                        } else {
                            response.success = false;
                            response.detail = "Did not retrieve proper path";
                        }
                    }
                }
                res.send(response);
            });
        } else {
            response.success = false;
            response.detail = "Start, end, or river is null";
        }
    });

    app.get('/api/mobile/point/:point_id', function(req, res) {
        var response = {};
        connection.query('SELECT * FROM point WHERE id = ?', req.params.point_id, function(error, rows) {
            if (error) {
                response.success = false;
                response.detail = error;
            } else if (rows.length != 1) {
                response.success = false;
                response.detail = "More or less than 1 point returned";
            } else {
                response.success = true;
                response.data = rows[0];
            }
            res.send(response);
        });
    })

    app.get('/api/mobile/*', function(req, res) {
        res.send({
            success: false,
            detail: "Failed to hit any api endpoints!"
        });
    });

    app.get('/', function(req, res) {
        res.send("<html><body><h1>PB</h1></body></html>");
    });


}

function linksToTime(links) {
    var time = 0;
    var totalDist = 0;
    var link, dist, start, end;
    for (var i = 0; i < links.length; i++) {
        link = links[i];
        start = {
            latitude: link.begin_lat,
            longitude: link.begin_lng
        };
        end = {
            latitude: link.end_lat,
            longitude: link.end_lng
        };
        dist = geolib.getDistance(start, end);
        //meters to miles conversion
        dist = dist * 0.000621371;
        totalDist += dist;
        time += dist / link.speed * 60;
    }
    return [time, totalDist];
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}