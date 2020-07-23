var gulp = require('gulp');
var sass = require('gulp-sass');
//var watch = require('gulp-watch');
var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
var del = require('del');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var fileinclude = require('gulp-file-include');;

gulp.sources = {
    src:  './src',
    dev: './dist',
    dist: './dist'
  };
// Start server dev
gulp.task('connect:dev', () => {
    connect.server({
      root: [gulp.sources.dev, './'],
      livereload: false,
      port: 9000,
      host: '0.0.0.0',
      fallback: gulp.sources.dev + '/index.html'
    });
  });

  // Remove dist, tmp
gulp.task('clean', (done) => {
    del.sync(gulp.sources.dev, gulp.sources.dist);
    done();
  });

gulp.task('sass',function () {
    return gulp.src(gulp.sources.src+'/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass())
    .pipe(gulp.dest(gulp.sources.src+'/css/'))

    
});

gulp.task('css',function(){
  return gulp.src(gulp.sources.src+'/css/**/*.css')
  .pipe(gulp.dest(gulp.sources.dev+'/css/'))


})
gulp.task('html',function(){
  return gulp.src(gulp.sources.src+'/**/*.html')
  .pipe(gulp.dest(gulp.sources.dev+'/'))

 
})

gulp.task('js',function(){
  return gulp.src(gulp.sources.src+'/js/**/*.js')
  .pipe(gulp.dest(gulp.sources.dev+'/js/'))


})


gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "127.0.0.1:9000"
    });
  });

  // Build source
gulp.task('build', function(done) {
    return gulp.series(
      'clean',
      'sass',
      'js',
      'html',
      'fileincludedev'

  )(done)});

  /**
   * minify js and css
   * exmaple js:
   * <!--build:js js/main.min.js -->
    <script src="js/lib/a-library.js"></script>
    <script src="js/lib/another-library.js"></script>
    <script src="js/main.js"></script>
    <!-- endbuild -->
   * example css
    <!--build:css css/styles.min.css-->
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/another-stylesheet.css">
    <!--endbuild-->
   */
  gulp.task('useref', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulp.dest('dist'))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
  });
//minify images
gulp.task('images', function(){
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});
gulp.task("stream",function(){
  gulp.watch(gulp.sources.src + '/**/*.html', gulp.series('fileincludedev'));
  gulp.watch(gulp.sources.src + '/**/*.css', gulp.series('css'));
  gulp.watch(gulp.sources.src + '/**/*.scss', gulp.series('sass'));
  gulp.watch(gulp.sources.src + '/**/*.js', gulp.series('js'));
})

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})
gulp.task('fileincludedev', () => {
  return gulp.src([gulp.sources.src + '/views/pages/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(gulp.sources.dev))

});

gulp.task('run:dev',()=>{
  gulp.series('clean')(gulp.parallel([ 'connect:dev', 'html','fileincludedev','js','css','sass', 'stream'], 'browser-sync', () => {
    console.log('Development version is running...');
  }));
});
