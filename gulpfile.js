var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    gulpIf = require('gulp-if');

var appFiles = 'src/**/*.js';

gulp.task('build-angular-next', function () {
    return gulp.src(appFiles)
        .pipe(traceur({
            experimental: true,
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            typeAssertions: true,
            typeAssertionModule: "assert"
        }))
        .pipe(concat('angularNext.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['build-angular-next'], function () {
    gulp.src([
        'bower_components/traceur-runtime/traceur-runtime.js',
        'bower_components/es6-module-loader/dist/es6-module-loader.src.js',
        'lib/systemjs-register/extension-register.js',
        'lib/systemjs-register/initialize-register.js',
        'lib/assert/assert.js',
        'dist/angularNext.js'])
        .pipe(gulpIf(/assert.js/,
            traceur({modules: 'instantiate', moduleName: true})
        ))
        .pipe(concat('angularNext-standalone.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function () {
    gulp.watch(appFiles, ['build']);
});