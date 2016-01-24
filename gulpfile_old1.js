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
var localhost = 'localhost:3000';
var cache = new Cache();
var javascript = 'script.js';
var server = 'server.js';
var distRoot = 'public/dist';
var srcRoot = 'public/src';
var SOURCE = {
  js: srcRoot + '/js/*.js',
  scss: srcRoot + '/scss/*.scss',
  html: srcRoot + '/**/*.html'
};
var DIST = {
  css: distRoot + '/css',
}

//
//
gulp.task('lint-js', function () {
  return gulp.src(SOURCE.js)
    .pipe(jshint());
});

//
// Combine JS into one and put in dist dir.
gulp.task("build-js", function () {
  return gulp.src(SOURCE.js)
    .pipe(concat(javascript))
    .pipe(gulp.dest(dist + '/js'));
});

gulp.task("build-css", function() {

});

gulp.task("build-html", function() {

});
