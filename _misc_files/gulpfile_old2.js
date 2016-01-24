'use strict'
//
var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var Cache = require('gulp-file-cache');
var semanticWatch = require('./semantic/tasks/watch');
var buildCSS = require('./semantic/tasks/build/css');
var buildAssets = require('./semantic/tasks/build/assets');


//
//
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'Safari >= 7', 'Opera >= 23', 'iOS >= 7', 'ChromeAndroid >= 4.4', 'bb >= 10'
];
var localhost = 'localhost:3000';
var cache = new Cache();
var src = 'public/src';
var dist = 'public/dist';
var javascript = 'script.js';
var server = 'server.js';
var SOURCE = {
  js: src + '/js/*.js',
  scss: src + '/scss/*.scss',
  css: dist + '/css',
  html: src + '/**/*.html'
};

//
//
gulp.task('sass', function() {
  gulp.src(SOURCE.scss)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    .pipe(gulp.dest(SOURCE.css))
    .pipe(reload({ stream: true }));
});

//
//
gulp.task('browser-sync', function() {
  browserSync({
    proxy: "localhost:3000"
  });
});

//
//
gulp.task('watch-semantic', 'Watch for site/theme changes', semanticWatch);
gulp.task('build-css', 'Builds all css from source', buildCSS);
gulp.task('build-assets', 'Copies all assets from source', buildAssets);

//
//
gulp.task('watch-sass', ['sass', 'browser-sync'], function() {
  gulp.watch(SOURCE.scss, ['sass']);
});

//
//
gulp.task('compile', ['build-assets', 'build-css'], function () {
  var stream = gulp.src(SOURCE.js) // your ES2015 code
                   .pipe(cache.filter()) // remember files
                   .pipe(babel()) // compile new ones
                   .pipe(cache.cache()) // cache them
                   .pipe(gulp.dest(dist)) // write them
  return stream // important for gulp-nodemon to wait for completion
});

gulp.task('watch-server', ['watch-semantic'], function () {
  var stream = nodemon({
                 script: server // run ES5 code
               , watch: server.js // watch ES2015 code
               , tasks: ['compile'] // compile synchronously onChange
               }).on('start', function () {

               })

  return stream
});
