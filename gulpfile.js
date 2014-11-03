var gulp = require('gulp'),
traceur = require('gulp-traceur');

var appFiles = 'src/**/*.js';

gulp.task('build', function () {
    return gulp.src(appFiles)
        .pipe(traceur({experimental: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function () {
    gulp.watch(appFiles, ['build']);
});