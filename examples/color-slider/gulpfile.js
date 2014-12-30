var gulp = require('gulp'),
    traceur = require('gulp-traceur'),
    connect = require('gulp-connect'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    lazypipe = require('lazypipe');

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
    'src/css/**/*.css'
];

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    var buildAtScript = lazypipe()
        .pipe(rename, function (path) {
            //remove .ats from the filename
            path.basename = path.basename.substring(0, path.basename.length - 4);
        })
        .pipe(traceur, {
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            typeAssertions: true,
            typeAssertionModule: 'assert.js'
        });

    gulp.src('src/**/*.js')
        //Only files ending in .ats.js will be treated as AtScript and transpiled with Traceur
        .pipe(gulpIf(/\.ats\.js$/, buildAtScript()))
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
    gulp.watch([cssFiles], ['css']);
});