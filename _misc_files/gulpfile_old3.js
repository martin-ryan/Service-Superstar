'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var Cache = require('gulp-file-cache');
// var browserSync = require('browser-sync').create();
// var livereload = require('gulp-livereload');

//
//
var localhost = 'localhost:3000';
var cache = new Cache();
var src = 'public/src';
var dist = 'public/dist';
var javascript = 'script.js';
var server = 'server.js';
var source = {
  js: src + '/js/*.js',
  scss: src + '/scss/*.scss',
  html: src + '/**/*.html'
};

//
//
gulp.task('lint', function () {
  gulp.src(source.js)
    .pipe(jshint())
})

//
//
gulp.task('develop', function () {
  nodemon({ script: 'server.js'
          // , ext: 'html js'
          , ignore: ['']
          , tasks: [ 'lint', 'combine-js', 'compress-html', 'compile-js', 'compile-html', 'watch'] })
    .on('restart', function () {
      console.log('restarted!')
    })
})

//
//
// Combine & Compress JS into one script.js
gulp.task('combine-js', function () {
  return gulp.src(source.js)
    // .pipe(stripDebug()) // strip all debugs and alerts
    .pipe(concat(javascript))
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/js'));
});

//
// Compress HTML
gulp.task('compress-html', function () {
  return gulp.src(source.html)
    .pipe(minifyhtml())
    .pipe(gulp.dest(dist + '/'));
});

//
//
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: localhost
//     });
// });

//
//
gulp.task('compile', function () {
  var stream = gulp.src(source.js) // your ES2015 code
                   .pipe(cache.filter()) // remember files
                   .pipe(babel({ ... })) // compile new ones
                   .pipe(cache.cache()) // cache them
                   .pipe(gulp.dest(dist)) // write them
  return stream // important for gulp-nodemon to wait for completion
})

gulp.task('watch', ['compile'], function () {
  var stream = nodemon({
                 script: 'dist/' // run ES5 code
               , watch: source.js // watch ES2015 code
               , tasks: ['compile'] // compile synchronously onChange
               }).on('start', function () {

               })

  return stream
})


//
//
gulp.task('default', [ 'lint', 'combine-js', 'compress-html', 'watch', 'develop']);
