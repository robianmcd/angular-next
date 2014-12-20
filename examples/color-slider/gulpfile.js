var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    connect = require('gulp-connect');

var vendorFiles = [
    'bower_components/angular-next/dist/angularNext-standalone.js',
    'bower_components/angular/angular.js'
];

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('src/**/*.js')
        .pipe(traceur({modules: 'instantiate', moduleName: true, annotations: true}))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('vendor', function () {
    gulp.src(vendorFiles)
        .pipe(gulp.dest('build/vendor'))
});

gulp.task('default', ['js', 'html', 'vendor'], function () {
    connect.server({
        livereload: true,
        root: 'build'
    });

    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['src/**/*.js'], ['js']);
});