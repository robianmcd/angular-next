var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    connect = require('gulp-connect');

var vendorFiles = [
    'bower_components/angular-next/dist/angularNext-standalone.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular-material/angular-material.js'
];

var cssFiles = [
    'bower_components/angular-material/angular-material.css',
    'bower_components/angular-material/themes/blue-grey-theme.css',
    'src/**/*.css'
];

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('src/**/*.js')
        .pipe(traceur({modules: 'instantiate', moduleName: true, annotations: true, types:true, typeAssertions: true, typeAssertionModule: 'assert'}))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src(cssFiles)
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
});

gulp.task('vendor', function () {
    gulp.src(vendorFiles)
        .pipe(gulp.dest('build/vendor'))
});

gulp.task('default', ['js', 'html', 'css', 'vendor'], function () {
    connect.server({
        livereload: true,
        root: 'build'
    });

    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['src/**/*.js'], ['js']);
});