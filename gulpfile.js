/**
 * Created by klaseter3-gtri on 1/29/2016.
 */
var gulp = require('gulp');
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var Point = require('./public/models/point');
var sass = require('gulp-sass');

'use strict';

// configuration =================

gulp.task('express', function() {
    mongoose.connect('mongodb://kodylaseter:manhunt1@ds047712.mongolab.com:47712/pbdb');     // connect to mongoDB database

    app.use(require('connect-livereload')({port: 35729}));
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.set('port', process.env.PORT || 8080);

    //ROUTES
    app.get('/api/points', function(req, res) {
        Point.find(function(err, points) {
            console.log('points get called');
            if (err)
                res.send(err)
            res.json(points);
        });
    });

    app.post('/api/points', function(req, res) {
        for (var i = 0; i < req.body.length; i++) {
            Point.create({
                lat: req.body[i].lat,
                lng: req.body[i].lng
            }, function(err, point) {
                if (err) res.send(err);
            });
        }
    });

    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });


//launch server--------------------------------------------
    app.listen(4000, '0.0.0.0');
    console.log("App listening on port 4000");
});

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('sass', function () {
    //need to minify hereeeee
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('public/**/*.css', notifyLiveReload);
    gulp.watch('public/**/*.html', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch', 'sass'], function() {

});