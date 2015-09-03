var gulp = require('gulp');
var concat = require('gulp-concat');
var ngmin = require('gulp-ngmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');
var uglifyCSS = require('gulp-minify-css');
var header = require('gulp-header');

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
});

gulp.task('add-header', ['min-js', 'min-css'], function () {

    var pkg = require('./package.json');

    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @author <%= pkg.author.name %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');

    return gulp.src('./dist/*.js')
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./dist/'));

});

gulp.task('default', ['add-header'], function () {

});

var watcher = gulp.watch([
    './app.js',
    './model/ngPopupBuilder.js',
    './directive/ngPopupDirective.js',
    './css/ngPopupStyle.css'
    ], ['default']);

watcher.on('change', function(event) {
    console.log('ngPopup starting gulp build tasks...' + Date.now());
});
