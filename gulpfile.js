var gulp = require('gulp');
var concat = require('gulp-concat');
var ngmin = require('gulp-ngmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');
var uglifyCSS = require('gulp-minify-css');

gulp.task('concat-js', function () {
    return gulp.src(['./app.js', './model/ngPopupBuilder.js', './directive/ngPopupDirective.js'])
        .pipe(concat('ngPopup.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('min-js', ['concat-js'], function () {
    return gulp.src('./dist/ngPopup.js')
        .pipe(ngmin())
        .pipe(annotate())
        .pipe(uglify())
        .pipe(rename('ngPopup.min.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('move-css', function () {
    return gulp.src('./css/ngPopupStyle.css')
        .pipe(rename('ngPopup.css'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('min-css', ['move-css'], function () {
    return gulp.src('./dist/ngPopup.css')
        .pipe(uglifyCSS())
        .pipe(rename('ngPopup.min.css'))
        .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['min-js', 'min-css'], function () {

});
