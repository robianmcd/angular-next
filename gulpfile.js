var gulp = require('gulp'),
traceur = require('gulp-traceur'),
concat = require('gulp-concat'),
insert = require('gulp-insert');

var appFiles = 'src/**/*.js';

gulp.task('build', function () {
    return gulp.src(appFiles)
        .pipe(traceur({experimental: true, modules: 'register', moduleName: true, annotations: true, types: true, typeAssertions: true, typeAssertionModule: "lib/assert"}))
        .pipe(concat('angularNext.js'))
        .pipe(insert.append('System.get("angularNext" + "");'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['build'], function () {
    gulp.watch(appFiles, ['build']);
});