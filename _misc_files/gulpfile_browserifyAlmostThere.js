'use strict'
//
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var vinylTransform = require('vinyl-transform')
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var semanticBuild = require('./src/lib/semantic/tasks/build');


var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUTPUT: 'bundle.js',
  DEST: 'build',
  DEST_PROD: 'build/prod',
  DEST_DEV: 'build/dev',
  ENTRY_POINT: './src/scripts/App.js'
};

// ***** DEVELOPMENT ***** //
//
//
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST_DEV));
});

gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_DEV))
      console.log('Development Build Created');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_DEV));
});


// ***** PRODUCTION ***** //
//
//
gulp.task('build-prod', function(){
  //
  return browserify(path.ENTRY_POINT)
    .bundle()
    .pipe(vinylSource(path.OUTPUT)) // gives streaming vinyl file object
    .pipe(vinylBuffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works
    .pipe(gulp.dest(path.DEST_DEV));


  //
  //
  // var browserified = vinylTransform(function(filename) {
  //   return browserify(filename).bundle();
  // });
  //
  // return gulp.src([path.ENTRY_POINT])
  //   .pipe(browserified)
  //   .pipe(uglify())
  //   .pipe(gulp.dest('buid/prod'));


  //
  //
  // return gulp.src(path.ENTRY_POINT)
  //   .pipe(browserify({
  //     enteries: path.ENTRY_POINT,
  //     transform: [reactify]
  //   })).bundle()
  //   .pipe(vinylTransform())
  //   .pipe(uglify())
  //   .pipe(gulp.dest(path.DEST_PROD));


  // var browserified = browserify({
  //   enteries: path.ENTRY_POINT,
  //   transform: [reactify]
  // }).bundle();
  // var vinylTransformed = vinylTransform(browserified);
  // //
  // return gulp.src("src/js/App.js")
  //   .pipe(vinylTransformed)
  //   .pipe(uglify())
  //   .pipe(gulp.dest(path.DEST_PROD));

  // browserify({
  //   entries: [path.ENTRY_POINT],
  //   transform: [reactify]
  // })
  //   .bundle()
  //   .pipe(source(path.MINIFIED_OUT))
  //   .pipe(buffer())
  //   .pipe(uglify())
  //   .pipe(streamify())
  //   .pipe(gulp.dest(path.DEST_PROD));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST_PROD));
});

gulp.task('prod', ['replaceHTML', 'build-prod']);


// ***** DEFAULT TASK ***** //
//
//
gulp.task('default', ['watch']);




//
//
// var semanticWatch = require('./semantic/tasks/watch');
// var buildCSS = require('./semantic/tasks/build/css');
// var buildAssets = require('./semantic/tasks/build/assets');
gulp.task('semantic-build', 'Build all Semantic files', semanticBuild);
// gulp.task('watch-semantic', 'Watch for site/theme changes', semanticWatch);
// gulp.task('build-css', 'Builds all css from source', buildCSS);
// gulp.task('build-assets', 'Copies all assets from source', buildAssets);
