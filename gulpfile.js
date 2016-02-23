var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var watch = require('gulp-watch')
var del = require('del');
var rename = require('gulp-rename');

var pkg = require('./package.json');

gulp.task('uglify', ['clean'], function () {
    return gulp.src('./js/' + pkg.name + '.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'))
});

gulp.task('less', ['clean'], function () {
    return gulp.src('./less/' + pkg.name + '.less')
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('mincss', ['less'], function () {
    return gulp.src('./css/' + pkg.name + '.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css'));
});

gulp.task('clean', function () {
    return del([
        './css/' + pkg.name + '.css',
        './css/' + pkg.name + '.min.css',
        './js/' + pkg.name + '.min.js'
    ]);
});

gulp.task('default', ['uglify', 'less', 'mincss'], function() {
  // place code for your default task here
});