/**
 * Created by klaseter3-gtri on 1/29/2016.
 */
var gulp = require('gulp');
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