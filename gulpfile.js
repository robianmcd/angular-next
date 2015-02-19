var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    concat = require('gulp-concat'),
    karma = require('gulp-karma'),
    gulpIf = require('gulp-if');

var appFiles = 'src/**/*.js';
var testFiles = 'test/**/*.js';

var filesForKarma = [
    'bower_components/angular/angular.js',
    'dist/angularNext-standalone.js',
    'test-build/**/*.js',
    'testMain.js'
];

var traceurOptions = {
    experimental: true,
    modules: 'instantiate',
    moduleName: true,
    annotations: true,
    types: true,
    typeAssertions: true,
    typeAssertionModule: "angular2/rtts-assert.js"
};

gulp.task('build-angular-next', function () {
    return gulp.src(appFiles)
        .pipe(traceur(traceurOptions))
        .pipe(concat('angularNext.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('build-test-files', function () {
    return gulp.src(testFiles)
        .pipe(traceur(traceurOptions))
        .pipe(gulp.dest('test-build'));
});

gulp.task('build', ['build-angular-next', 'build-test-files'], function () {
    gulp.src([
        'bower_components/traceur-runtime/traceur-runtime.js',
        'bower_components/es6-module-loader/dist/es6-module-loader.src.js',
        'lib/systemjs-register/extension-register.js',
        'lib/systemjs-register/initialize-register.js',
        'dist/angularNext.js'])
        .pipe(concat('angularNext-standalone.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    return gulp.src(filesForKarma)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});

gulp.task('default', ['build'], function () {
    gulp.watch([appFiles], ['build']);
    gulp.watch([testFiles], ['build-test-files']);

    gulp.src(filesForKarma)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }));
});