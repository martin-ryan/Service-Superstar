'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
// var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

//
//
var src = 'public/src';
var dist = 'public/dist';
var javascript = 'script.js';
var server = 'server.js';
var paths = {
  js: src + '/js/*.js',
  scss: src + '/scss/*.scss',
  html: src + '/**/*.html'
};

//
//
gulp.task('lint', function () {
  return gulp.src(paths.js)
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint({
        "globals":{
          "jQuery": false,
          "$": true
        }
      }))
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());

});

// Combine & Compress JS into one script.js
gulp.task('combine-js', function () {
  return gulp.src(source.js)
    // .pipe(stripDebug()) // strip all debugs and alerts
    .pipe(concat(javascript))
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/js'));
});

//
// Compile sass to css
// gulp.task('compile-sass', function () {
//   return gulp.src(paths.scss)
//     .pipe(sass())
//     .pipe(gulp.dest(dist + '/css'));
// });

//
// Compress HTML
gulp.task('compress-html', function () {
  return gulp.src(paths.html)
    .pipe(minifyhtml())
    .pipe(gulp.dest(dist + '/'));
});

// Watch files and reload browser
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.js, ['combine-js']);
  // gulp.watch(paths.scss, ['compile-sass']);
  gulp.watch(paths.html, ['compress-html']);
  gulp.watch(dist + '/**').on('change', livereload.changed);
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
// gulp.task('serverjs-lint', function () {
//   gulp.src(server)
//     .pipe(jshint());
// });
//
// gulp.task('develop', function () {
//   nodemon({ script: 'server.js'
//           , tasks: ['lint'] })
//     .on('restart', function () {
//       console.log('restarted!')
//     })
// })

//
//
gulp.task('default', [ 'lint', 'combine-js', 'compress-html', 'watch', 'develop']);
  //
  //
  // gulp.task('default', [
  //   'lint', 'combine-js',
  //   'compile-sass', 'compress-html',
  //   'watch' ]);
