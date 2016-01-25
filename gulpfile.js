'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var rename = require("gulp-rename");
var babelify = require('babelify');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync').create();
var node;

var path = {
  SERVER: 'server.js',
  ROUTES: 'routes/**/*.js',
  IMAGES: 'src/lib/images/**.*',
  FONTS: 'src/lib/fonts/**.*',
  CSS: 'src/css/**.*',
  SCRIPTS: 'src/scripts/**.*'
  HTML: 'src/index.html',
  HTML_DEV: 'build/dev/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUTPUT: 'bundle.js',
  DEST: 'build',
  DEST_PROD: 'build/prod',
  DEST_DEV: 'build/dev',
  ENTRY_POINT: 'src/scripts/app.js'
};


//
//  SERVER STUFF -------------
//
var serverRun = function () {
  if (node) node.kill()
  // spawn(CLI command, args, options)
  node = spawn('node', ['server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
};
//
gulp.task('server-watch', function() {

  serverRun();

  gulp.watch([path.SERVER, path.ROUTES], function() {
    serverRun();
  });
});
//
process.on('exit', function() {
    if (node) node.kill()
})

//
//  HTML STUFF -----------
//
gulp.task('html-copy', function(){
  return gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST_DEV));
});

gulp.task('html-watch', function(){
  gulp.watch(path.HTML, ['html-copy']);
});

//
//  CSS STUFF ------------
//
// gulp.task('sass', function() {
//   return gulp.src(path.CSS)
//       .pipe(sass())
//       .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//       .pipe(concatCss('style.css'))
//       .pipe(gulp.dest('./build/'))
// });

//
//  SCRIPTS STUFF ------------
//
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}
//
function buildWatchScript(file) {

  var props = {
    entries: [file],
    debug : true,
    transform: [reactify, babelify]
  };

  var bundler = watchify(browserify(props));

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest(path.DEST_DEV))
  }

  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
};
//
gulp.task('scripts-watch', function() {
  // gulp.watch('css/scss/*.scss', ['sass']);
  return buildWatchScript(path.ENTRY_POINT);
});

//
//  BROWSER RELOADING
//
gulp.task('browserSync-init', function() {
    browserSync.init({
        proxy: "localhost:3000"
    });
    gulp.watch([path.HTML, path.IMAGES, path.FONTS path.CSS, path.SCRIPTS]).on('change', browserSync.reload);
});

//
//  GULP DEFAULT TASK ---------
//
gulp.task('default', ['scripts-watch', 'html-copy', 'html-watch', 'browserSync-init', 'server-watch']);


//
//  PRODUCTION
//
function buildProdScript(file) {

  var props = {
    entries: [file],
    debug : true,
    transform: [reactify, babelify]
  };

  var bundler = browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(streamify(uglify()))
      .pipe(rename("bundle.min.js"))
      .pipe(gulp.dest(path.DEST_PROD));
  }

  return rebundle();
}
//
gulp.task('build-prod', function() {
  return buildProdScript(path.ENTRY_POINT);
});

// gulp.task('sass-build', function() {
//   return gulp.src('css/scss/*.scss')
//       .pipe(sass())
//       .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//       .pipe(concatCss('style.min.css'))
//       .pipe(minifyCss({compatibility: 'ie8'}))
//       .pipe(gulp.dest('./build/'))
// });

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML_DEV)
    .pipe(htmlreplace({
      'css': 'style.min.css',
      'js': 'bundle.min.js'
    }))
    .pipe(gulp.dest(path.DEST_PROD));
});

gulp.task('prod', ['build-prod', 'replaceHTML']);
