/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

var config = {
      srcPath: 'src',
     bowerPath: 'bower_components' 
}


gulp.task('icons', function() { 
  return gulp.src(config.bowerPath + '/font-awesome/fonts/**.*') 
    .pipe(gulp.dest('assets/fonts')); 
});

gulp.task('styles', function() { 
  return sass(config.srcPath + '/styles/style.scss', {
        style: 'compressed',
        loadPath: [
          config.bowerPath + '/bootstrap-sass/assets/stylesheets',
          config.bowerPath + '/font-awesome/scss',
        ]})
    .pipe(autoprefixer('last 2 version'))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest(''))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(config.srcPath + '/scripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    //.pipe(uglify())
    .pipe(gulp.dest('assets/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('fonts', function() {
  return gulp.src(config.srcPath + '/styles/fonts/*')
    .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('images', function() {
  return gulp.src(config.srcPath + '/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
  return del(['assets/styles', 'assets/scripts', 'assets/images']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'fonts', 'icons', 'watch');
});


gulp.task('watch', function() {

  gulp.watch(config.srcPath + '/styles/**/*.scss', ['styles']);
  gulp.watch(config.srcPath + '/scripts/**/*.js', ['scripts']);
  gulp.watch(config.srcPath + '/images/**/*', ['images']);

  livereload.listen();

  gulp.watch(['assets/**']).on('change', livereload.changed);
  gulp.watch(['*.html']).on('change', livereload.changed);

});

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
