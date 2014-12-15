var gulp = require('gulp'),
    traceur = require('gulp-traceur');

var appFiles = 'src/**/*.js';
var vendorFiles = [
    'bower_components/angular/angular.js',
    '../dist/angularNext-standalone.js'
];
var indexFile = 'src/index.html';

gulp.task('vendor', function () {
    return gulp.src(vendorFiles)
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('app', function () {
    return gulp.src(appFiles)
        .pipe(traceur({experimental: true, modules: 'instantiate', moduleName: true, annotations: true, types: true, typeAssertions: true, typeAssertionModule: "assert"}))
        .pipe(gulp.dest('build'));
});

gulp.task('index', function () {
    return gulp.src(indexFile)
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['vendor', 'app', 'index']);

gulp.task('default', ['build'], function () {
    gulp.watch(appFiles, ['app']);
    gulp.watch(vendorFiles, ['vendor']);
    gulp.watch(indexFile, ['index']);
});