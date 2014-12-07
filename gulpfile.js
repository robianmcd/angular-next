var gulp = require('gulp'),
traceur = require('gulp-traceur'),
concat = require('gulp-concat'),
insert = require('gulp-insert');

var appFiles = 'src/**/*.js';

gulp.task('build', function () {
    return gulp.src(appFiles)
        .pipe(traceur({experimental: true, modules: 'instantiate', moduleName: true, annotations: true, types: true, typeAssertions: true, typeAssertionModule: "lib/assert"}))
        .pipe(concat('angularNext.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['build'], function () {
    gulp.watch(appFiles, ['build']);
});