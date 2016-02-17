/**
 * Created by klaseter3-gtri on 1/29/2016.
 */
var gulp = require('gulp');
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var tinylr;
'use strict';

// configuration =================

gulp.task('express', function() {
    nodemon({ script: 'server.js'
        , ext: 'js'
        , ignore: ['public/**/*.js']})
        .on('restart', function () {
            notifyLiveReload({
                type: 'changed',
                path: './public/index.html'
            });
        })
});

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
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('public/**/*.css', notifyLiveReload);
    gulp.watch('public/**/*.js', notifyLiveReload);
    gulp.watch('public/**/*.html', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch', 'sass'], function() {

});