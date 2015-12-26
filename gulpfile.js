// Include gulp
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plum = require('gulp-plumber'),
    sync = require('browser-sync'),
    auto = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function() {
  sync({
    proxy: 'localhost/chrome'
  });
  gulp.watch(['./*.html']).on('change', sync.reload);
  gulp.watch(['./scss/*.scss'],['sass']);
});

gulp.task('sass', function() {
  return gulp.src('./scss/app.scss')
    .pipe(plum())
    .pipe(sass().on('error', sass.logError))
    .pipe(auto({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('./css'))
    .pipe(sync.stream());
});

gulp.task('watch', ['serve'], function() {
  gulp.watch('./scss/*.scss', ['sass']);
});

gulp.task('default', ['serve'], function() {});
