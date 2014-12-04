var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    insert = require('gulp-insert');

var appFiles = 'src/**/*.js';
var vendorFiles = [
    'bower_components/traceur-runtime/traceur-runtime.js',
    'bower_components/angular/angular.js',
    '../dist/angularNext.js'
];
var indexFile = 'src/index.html';

gulp.task('vendor', function () {
    return gulp.src(vendorFiles)
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('app', function () {
    return gulp.src(appFiles)
        .pipe(traceur({experimental: true, modules: 'register', moduleName: true, annotations: true, types: true, typeAssertions: true, typeAssertionModule: "lib/assert"}))
        .pipe(insert.append('System.get("app" + "");'))
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